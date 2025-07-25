create table public.categories (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text not null,
  slug text not null unique,
  featured boolean default false
);

-- Create policy to allow any authenticated user to view categories
create policy "Anyone can view categories"
  on public.categories for select
  to authenticated
  using (true);

-- Create policy to allow admins to manage categories
create policy "Admins can manage categories"
  on public.categories for all
  to authenticated
  using (
    exists (
      select 1
      from auth.users
      where auth.uid() = auth.users.id
      and auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Enable RLS
alter table public.categories enable row level security;

-- Insert some initial categories
insert into public.categories (name, description, slug, featured) values
  ('Web Development', 'Learn to build modern web applications and master frontend & backend technologies', 'web-development', true),
  ('Mobile Development', 'Create native and cross-platform mobile apps for iOS and Android', 'mobile-development', true),
  ('Data Science', 'Master data analysis, machine learning, and artificial intelligence', 'data-science', true),
  ('Design', 'Learn UI/UX design, graphic design, and digital art creation', 'design', false),
  ('DevOps', 'Master cloud computing, CI/CD, and deployment technologies', 'devops', false),
  ('Security', 'Learn cybersecurity, ethical hacking, and system protection', 'security', false);
