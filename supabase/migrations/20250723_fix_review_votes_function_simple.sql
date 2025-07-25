-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS get_review_votes(text[]);
DROP FUNCTION IF EXISTS get_review_votes(uuid[]);

-- Create a simpler version of the function
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
BEGIN
    -- Get the authenticated user ID
    _user_id := auth.uid();
    
    RETURN QUERY
    WITH base_reviews AS (
        SELECT DISTINCT unnest(review_ids)::uuid as review_id
    ),
    vote_counts AS (
        SELECT 
            rv.review_id,
            SUM(CASE WHEN rv.vote_type = 'up' THEN 1 WHEN rv.vote_type = 'down' THEN -1 ELSE 0 END)::BIGINT as vote_score
        FROM review_votes rv
        WHERE rv.review_id::text = ANY(review_ids)
        GROUP BY rv.review_id
    ),
    user_votes AS (
        SELECT 
            rv.review_id,
            rv.vote_type as user_vote
        FROM review_votes rv
        WHERE rv.user_id = _user_id
        AND rv.review_id::text = ANY(review_ids)
    )
    SELECT 
        br.review_id::uuid,
        COALESCE(vc.vote_score, 0::bigint) as vote_score,
        uv.user_vote
    FROM base_reviews br
    LEFT JOIN vote_counts vc ON vc.review_id = br.review_id
    LEFT JOIN user_votes uv ON uv.review_id = br.review_id;
END;
$$;

-- Grant execute permissions
REVOKE EXECUTE ON FUNCTION get_review_votes(text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_review_votes(text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION get_review_votes(text[]) TO anon;
