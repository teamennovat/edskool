-- Function to update review count
CREATE OR REPLACE FUNCTION update_profile_review_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.profiles 
        SET reviews_count = reviews_count + 1
        WHERE id = NEW.user_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.profiles 
        SET reviews_count = reviews_count - 1
        WHERE id = OLD.user_id;
    END IF;
    RETURN NULL;
END;
$$;

-- Create trigger for managing review count
DROP TRIGGER IF EXISTS on_review_change ON public.course_reviews;
CREATE TRIGGER on_review_change
    AFTER INSERT OR DELETE ON public.course_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_review_count();
