-- First drop ANY existing policies
DROP POLICY IF EXISTS "temp_allow_all" ON review_votes;
DROP POLICY IF EXISTS "allow_select" ON review_votes;
DROP POLICY IF EXISTS "allow_insert" ON review_votes;
DROP POLICY IF EXISTS "allow_update" ON review_votes;
DROP POLICY IF EXISTS "allow_delete" ON review_votes;
DROP POLICY IF EXISTS "manage_votes" ON review_votes;
DROP POLICY IF EXISTS "allow_read_votes" ON review_votes;
DROP POLICY IF EXISTS "allow_create_votes" ON review_votes;
DROP POLICY IF EXISTS "allow_update_own_votes" ON review_votes;
DROP POLICY IF EXISTS "allow_delete_own_votes" ON review_votes;

-- Make sure RLS is enabled
ALTER TABLE review_votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;

-- Create the new simplified policy
CREATE POLICY "temp_allow_all" ON review_votes
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (
        -- Only ensure the user is voting as themselves
        auth.uid() = user_id
    );

-- Drop and recreate the function
DROP FUNCTION IF EXISTS get_review_votes(UUID[]);

CREATE OR REPLACE FUNCTION get_review_votes(review_ids UUID[])
RETURNS TABLE (
    review_id UUID,
    vote_score BIGINT,
    user_vote TEXT
) 
SECURITY DEFINER
SET search_path = public, auth
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
            SUM(CASE 
                WHEN rv.vote_type = 'up' THEN 1 
                WHEN rv.vote_type = 'down' THEN -1 
                ELSE 0 
            END) as vote_score
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
REVOKE EXECUTE ON FUNCTION get_review_votes(UUID[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_review_votes(UUID[]) TO authenticated;
GRANT EXECUTE ON FUNCTION get_review_votes(UUID[]) TO anon;
