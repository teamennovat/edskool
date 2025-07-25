-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories
CREATE POLICY "Allow public read access to categories" 
ON public.categories
FOR SELECT 
TO public
USING (true);

-- Grant necessary permissions to both authenticated and anonymous users
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.categories TO authenticated;
