-- Create review votes table
CREATE TABLE public.review_votes (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    review_id uuid NOT NULL REFERENCES public.course_reviews(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vote_type text NOT NULL CHECK (vote_type IN ('up', 'down')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(review_id, user_id)
);

-- Create review reports table
CREATE TABLE public.review_reports (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    review_id uuid NOT NULL REFERENCES public.course_reviews(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reason text NOT NULL,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    resolved_at timestamp with time zone,
    UNIQUE(review_id, user_id)
);

-- Enable RLS
ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_reports ENABLE ROW LEVEL SECURITY;

-- Policies for review_votes
CREATE POLICY "Users can view all votes"
    ON public.review_votes FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can vote once per review"
    ON public.review_votes FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can change their own votes"
    ON public.review_votes FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
    ON public.review_votes FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Policies for review_reports
CREATE POLICY "Users can view their own reports"
    ON public.review_reports FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can report once per review"
    ON public.review_reports FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending reports"
    ON public.review_reports FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id AND status = 'pending')
    WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.review_votes TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.review_reports TO authenticated;

-- Create view for reviews with votes
CREATE OR REPLACE VIEW public.reviews_with_votes AS
SELECT 
    cr.*,
    p.full_name,
    p.avatar_url,
    COALESCE(upvotes.count, 0) as upvotes,
    COALESCE(downvotes.count, 0) as downvotes,
    COALESCE(reports.count, 0) as report_count
FROM 
    public.course_reviews cr
    LEFT JOIN public.profiles p ON cr.user_id = p.id
    LEFT JOIN (
        SELECT review_id, COUNT(*) as count 
        FROM public.review_votes 
        WHERE vote_type = 'up' 
        GROUP BY review_id
    ) upvotes ON cr.id = upvotes.review_id
    LEFT JOIN (
        SELECT review_id, COUNT(*) as count 
        FROM public.review_votes 
        WHERE vote_type = 'down' 
        GROUP BY review_id
    ) downvotes ON cr.id = downvotes.review_id
    LEFT JOIN (
        SELECT review_id, COUNT(*) as count 
        FROM public.review_reports 
        WHERE status = 'pending' 
        GROUP BY review_id
    ) reports ON cr.id = reports.review_id;

-- Set RLS on the view
ALTER VIEW public.reviews_with_votes SET (security_invoker = on);
