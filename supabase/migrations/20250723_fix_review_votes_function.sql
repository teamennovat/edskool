-- First drop ANY existing policies and functions
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

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS get_review_votes(UUID[]);
DROP FUNCTION IF EXISTS get_review_votes(text[]);

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

-- Create the function with text[] parameter
CREATE OR REPLACE FUNCTION get_review_votes(review_ids text[])
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
    _uuid_array UUID[];
BEGIN
    -- Get the authenticated user ID
    _user_id := auth.uid();
    
    -- Convert text array to UUID array
    _uuid_array := ARRAY(
        SELECT review_id::UUID 
        FROM unnest(review_ids) AS review_id 
        WHERE review_id IS NOT NULL
    );
    
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
        WHERE rv.review_id = ANY(_uuid_array)
        GROUP BY rv.review_id
    ),
    user_votes AS (
        SELECT 
            rv.review_id,
            rv.vote_type as user_vote
        FROM review_votes rv
        WHERE rv.user_id = _user_id
        AND rv.review_id = ANY(_uuid_array)
    )
    SELECT 
        r.id as review_id,
        COALESCE(vc.vote_score, 0) as vote_score,
        uv.user_vote
    FROM unnest(_uuid_array) AS r(id)
    LEFT JOIN vote_counts vc ON vc.review_id = r.id
    LEFT JOIN user_votes uv ON uv.review_id = r.id;
END;
$$;

-- Grant execute permissions
REVOKE EXECUTE ON FUNCTION get_review_votes(text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_review_votes(text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION get_review_votes(text[]) TO anon;
