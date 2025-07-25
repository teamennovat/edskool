-- First, drop all existing policies
DROP POLICY IF EXISTS "allow_select" ON review_votes;
DROP POLICY IF EXISTS "allow_insert" ON review_votes;
DROP POLICY IF EXISTS "allow_update" ON review_votes;
DROP POLICY IF EXISTS "allow_delete" ON review_votes;
DROP POLICY IF EXISTS "manage_votes" ON review_votes;
DROP POLICY IF EXISTS "allow_read_votes" ON review_votes;
DROP POLICY IF EXISTS "allow_create_votes" ON review_votes;
DROP POLICY IF EXISTS "allow_update_own_votes" ON review_votes;
DROP POLICY IF EXISTS "allow_delete_own_votes" ON review_votes;

-- Enable RLS
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;

-- Create a simple policy for testing
CREATE POLICY "temp_allow_all" ON review_votes
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (
        -- Only ensure the user is voting as themselves
        auth.uid() = user_id
    );

-- Let's add some debug logging to the function
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
    _debug_info RECORD;
BEGIN
    -- Get the authenticated user ID
    _user_id := auth.uid();
    
    -- Debug information
    CREATE TEMP TABLE IF NOT EXISTS vote_debug_log (
        timestamp TIMESTAMPTZ DEFAULT now(),
        user_id UUID,
        message TEXT
    );
    
    INSERT INTO vote_debug_log (user_id, message)
    VALUES (_user_id, 'Function called with user_id: ' || _user_id::TEXT);
    
    -- Get debug info about the review
    FOR _debug_info IN
        SELECT cr.id, cr.user_id as review_author_id
        FROM course_reviews cr
        WHERE cr.id = ANY(review_ids)
    LOOP
        INSERT INTO vote_debug_log (user_id, message)
        VALUES (_user_id, 'Review ' || _debug_info.id::TEXT || ' author: ' || _debug_info.review_author_id::TEXT);
    END LOOP;
    
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
