-- Create review_votes table
CREATE TABLE review_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id UUID NOT NULL REFERENCES course_reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(review_id, user_id)
);

-- Add RLS policies
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;

-- Create separate policies for different operations
CREATE POLICY "allow_select" ON review_votes
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "allow_insert" ON review_votes
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id
        AND NOT EXISTS (
            SELECT 1 FROM course_reviews
            WHERE id = review_votes.review_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "allow_update" ON review_votes
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "allow_delete" ON review_votes
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create a function to get vote counts and user's vote
CREATE OR REPLACE FUNCTION get_review_votes(review_ids UUID[])
RETURNS TABLE (
    review_id UUID,
    vote_score BIGINT,
    user_vote TEXT
) AS $$
DECLARE
    _user_id UUID;
BEGIN
    -- Get the authenticated user ID
    _user_id := auth.uid();
    
    -- Set proper search path
    SET LOCAL search_path TO public, auth;
    
    RETURN QUERY
    WITH vote_counts AS (
        SELECT 
            rv.review_id,
            SUM(CASE WHEN rv.vote_type = 'up' THEN 1 ELSE -1 END) as vote_score
        FROM public.review_votes rv
        WHERE rv.review_id = ANY(review_ids)
        GROUP BY rv.review_id
    ),
    user_votes AS (
        SELECT 
            rv.review_id,
            rv.vote_type as user_vote
        FROM public.review_votes rv
        WHERE rv.user_id = _user_id
        AND rv.review_id = ANY(review_ids)
    )
    SELECT 
        r.id as review_id,
        COALESCE(vc.vote_score, 0) as vote_score,
        uv.user_vote
    FROM unnest(review_ids) AS r(id)
    LEFT JOIN vote_counts vc ON vc.review_id = r.id
    LEFT JOIN user_votes uv ON uv.review_id = r.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to use the function
GRANT EXECUTE ON FUNCTION get_review_votes(UUID[]) TO authenticated;
GRANT EXECUTE ON FUNCTION get_review_votes(UUID[]) TO anon;
