-- Enable row level security
alter table "public"."subcategories" enable row level security;

-- Create policy to allow public read access to subcategories
create policy "Allow public read access"
on "public"."subcategories"
for select
to public
using (true);

-- Enable RLS for courses table
alter table "public"."courses" enable row level security;

-- Create policy to allow public read access to approved courses
create policy "Allow public read access to approved courses"
on "public"."courses"
for select
to public
using (status = 'approved');

-- Enable RLS for course_reviews table
alter table "public"."course_reviews" enable row level security;

-- Create policy to allow public read access to course reviews
create policy "Allow public read access to reviews"
on "public"."course_reviews"
for select
to public
using (true);
