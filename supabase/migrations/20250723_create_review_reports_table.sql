-- Create the review_reports table
CREATE TABLE IF NOT EXISTS public.review_reports (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    review_id uuid NOT NULL,
    user_id uuid NOT NULL,
    reason text NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT review_reports_pkey PRIMARY KEY (id),
    CONSTRAINT review_reports_review_id_user_id_key UNIQUE (review_id, user_id),
    CONSTRAINT review_reports_review_id_fkey FOREIGN KEY (review_id)
        REFERENCES public.course_reviews(id) ON DELETE CASCADE,
    CONSTRAINT review_reports_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT review_reports_status_check CHECK (status = ANY (ARRAY['pending'::text, 'reviewed'::text, 'resolved'::text, 'rejected'::text]))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS review_reports_review_id_idx ON public.review_reports USING btree (review_id);
CREATE INDEX IF NOT EXISTS review_reports_user_id_idx ON public.review_reports USING btree (user_id);
CREATE INDEX IF NOT EXISTS review_reports_status_idx ON public.review_reports USING btree (status);

-- Set up Row Level Security (RLS)
ALTER TABLE public.review_reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can report reviews" ON public.review_reports;
DROP POLICY IF EXISTS "Users can view their own reports" ON public.review_reports;
DROP POLICY IF EXISTS "Admins can view all reports" ON public.review_reports;

-- Create separate policies for different operations
-- Insert policy
CREATE POLICY "Users can report reviews" ON public.review_reports
    FOR INSERT 
    TO authenticated
    WITH CHECK (
        -- Cannot report own reviews
        NOT EXISTS (
            SELECT 1 
            FROM course_reviews cr
            WHERE cr.id = review_id 
            AND cr.user_id = auth.uid()
        )
    );

-- Select policy for regular users
CREATE POLICY "Users can view their own reports" ON public.review_reports
    FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 
            FROM profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'admin'
        )
    );

-- Update policy for admins
CREATE POLICY "Admins can update reports" ON public.review_reports
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 
            FROM profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'admin'
        )
    );

-- Delete policy for admins
CREATE POLICY "Admins can delete reports" ON public.review_reports
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 
            FROM profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'admin'
        )
    );

-- Update trigger for updated_at
DROP TRIGGER IF EXISTS set_review_reports_updated_at ON public.review_reports;
CREATE TRIGGER set_review_reports_updated_at
    BEFORE UPDATE ON public.review_reports
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Function to get report count for reviews
CREATE OR REPLACE FUNCTION get_review_report_count(review_ids uuid[])
RETURNS TABLE (
    review_id uuid,
    report_count bigint
) 
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id as review_id,
        COUNT(rr.id)::bigint as report_count
    FROM unnest(review_ids) AS r(id)
    LEFT JOIN review_reports rr ON rr.review_id = r.id
    GROUP BY r.id;
END;
$$;

-- Grant execute permissions
REVOKE EXECUTE ON FUNCTION get_review_report_count(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_review_report_count(uuid[]) TO authenticated;
GRANT EXECUTE ON FUNCTION get_review_report_count(uuid[]) TO anon;
