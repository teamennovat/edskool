-- Check if columns exist before adding them
DO $$ 
BEGIN 
    -- Add bio column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'profiles' 
                  AND column_name = 'bio') THEN
        ALTER TABLE public.profiles ADD COLUMN bio text;
    END IF;

    -- Add website column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'profiles' 
                  AND column_name = 'website') THEN
        ALTER TABLE public.profiles ADD COLUMN website text;
    END IF;

    -- Add twitter_username column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'profiles' 
                  AND column_name = 'twitter_username') THEN
        ALTER TABLE public.profiles ADD COLUMN twitter_username text;
    END IF;

    -- Add github_username column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'profiles' 
                  AND column_name = 'github_username') THEN
        ALTER TABLE public.profiles ADD COLUMN github_username text;
    END IF;
END $$;

-- Drop existing constraints if they exist
DO $$ 
BEGIN
    -- Drop twitter_username length constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.check_constraints 
               WHERE constraint_schema = 'public' 
               AND constraint_name = 'profiles_twitter_username_length') THEN
        ALTER TABLE public.profiles DROP CONSTRAINT profiles_twitter_username_length;
    END IF;

    -- Drop github_username length constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.check_constraints 
               WHERE constraint_schema = 'public' 
               AND constraint_name = 'profiles_github_username_length') THEN
        ALTER TABLE public.profiles DROP CONSTRAINT profiles_github_username_length;
    END IF;

    -- Drop website URL format constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.check_constraints 
               WHERE constraint_schema = 'public' 
               AND constraint_name = 'profiles_website_url') THEN
        ALTER TABLE public.profiles DROP CONSTRAINT profiles_website_url;
    END IF;

    -- Drop bio length constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.check_constraints 
               WHERE constraint_schema = 'public' 
               AND constraint_name = 'profiles_bio_length') THEN
        ALTER TABLE public.profiles DROP CONSTRAINT profiles_bio_length;
    END IF;
END $$;

-- Add new constraints
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_twitter_username_length 
    CHECK (twitter_username IS NULL OR length(twitter_username) <= 15),
ADD CONSTRAINT profiles_github_username_length 
    CHECK (github_username IS NULL OR length(github_username) <= 39),
ADD CONSTRAINT profiles_website_url 
    CHECK (website IS NULL OR website ~ '^https?://.*$'),
ADD CONSTRAINT profiles_bio_length 
    CHECK (bio IS NULL OR length(bio) <= 500);

-- Update RLS Policies if needed
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to update their own profile
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can update own profile'
    ) THEN
        CREATE POLICY "Users can update own profile" ON public.profiles
        FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;
