-- Add new columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS twitter_username text,
ADD COLUMN IF NOT EXISTS github_username text;

-- Add validation for twitter_username length
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_twitter_username_length 
CHECK (twitter_username IS NULL OR length(twitter_username) <= 15);

-- Add validation for github_username length
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_github_username_length 
CHECK (github_username IS NULL OR length(github_username) <= 39);

-- Add validation for website URL format
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_website_url 
CHECK (website IS NULL OR website ~ '^https?://.*$');

-- Add validation for bio length
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_bio_length 
CHECK (bio IS NULL OR length(bio) <= 500);
