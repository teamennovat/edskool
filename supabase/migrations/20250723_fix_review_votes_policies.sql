-- First, drop any existing policies
DROP POLICY IF EXISTS "allow_select" ON review_votes;
DROP POLICY IF EXISTS "allow_insert" ON review_votes;
DROP POLICY IF EXISTS "allow_update" ON review_votes;
DROP POLICY IF EXISTS "allow_delete" ON review_votes;
DROP POLICY IF EXISTS "manage_votes" ON review_votes;

-- Enable RLS if not already enabled
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to see votes
CREATE POLICY "allow_read_votes"
    ON review_votes FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to create votes
CREATE POLICY "allow_create_votes"
    ON review_votes FOR INSERT
    TO authenticated
    WITH CHECK (
        -- Must be the voter
        auth.uid() = user_id
        -- Cannot vote on own reviews
        AND NOT EXISTS (
            SELECT 1 
            FROM course_reviews cr
            WHERE cr.id = review_votes.review_id 
            AND cr.user_id = auth.uid()
        )
        -- Can only vote once per review (though this is also enforced by UNIQUE constraint)
        AND NOT EXISTS (
            SELECT 1 
            FROM review_votes rv
            WHERE rv.review_id = review_votes.review_id 
            AND rv.user_id = auth.uid()
        )
    );

-- Allow users to update their own votes
CREATE POLICY "allow_update_own_votes"
    ON review_votes FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (
        -- Must be the voter
        auth.uid() = user_id
        -- Cannot vote on own reviews
        AND NOT EXISTS (
            SELECT 1 
            FROM course_reviews cr
            WHERE cr.id = review_votes.review_id 
            AND cr.user_id = auth.uid()
        )
    );

-- Allow users to delete their own votes
CREATE POLICY "allow_delete_own_votes"
    ON review_votes FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Recreate the get_review_votes function with better error handling
CREATE OR REPLACE FUNCTION get_review_votes(review_ids UUID[])
RETURNS TABLE (
    review_id UUID,
    vote_score BIGINT,
    user_vote TEXT
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    _user_id UUID;
BEGIN
    -- Get the authenticated user ID
    _user_id := auth.uid();
    
    RETURN QUERY
    WITH vote_counts AS (
        SELECT 
            rv.review_id,
            COUNT(CASE WHEN rv.vote_type = 'up' THEN 1 END) - 
            COUNT(CASE WHEN rv.vote_type = 'down' THEN 1 END) as vote_score
        FROM review_votes rv
        WHERE rv.review_id = ANY(review_ids)
        GROUP BY rv.review_id
    ),
    user_votes AS (
        SELECT 
            rv.review_id,
            rv.vote_type as user_vote
        FROM review_votes rv
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
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_review_votes(UUID[]) TO authenticated;
GRANT EXECUTE ON FUNCTION get_review_votes(UUID[]) TO anon;
