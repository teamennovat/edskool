create table public.subcategories (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text not null,
  slug text not null,
  category_id uuid not null references public.categories(id) on delete cascade,
  featured boolean default false,
  unique(category_id, slug)
);

-- Create policy to allow any authenticated user to view subcategories
create policy "Anyone can view subcategories"
  on public.subcategories for select
  to authenticated
  using (true);

-- Create policy to allow admins to manage subcategories
create policy "Admins can manage subcategories"
  on public.subcategories for all
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
alter table public.subcategories enable row level security;

-- Insert initial subcategories
insert into public.subcategories (name, description, slug, category_id, featured) 
select 
  'React Development',
  'Build modern web applications with React and its ecosystem',
  'react',
  id,
  true
from public.categories where slug = 'web-development';

insert into public.subcategories (name, description, slug, category_id, featured)
select 
  'Node.js Backend',
  'Create scalable backend services with Node.js',
  'nodejs',
  id,
  true
from public.categories where slug = 'web-development';

insert into public.subcategories (name, description, slug, category_id, featured)
select 
  'Next.js Full Stack',
  'Build full-stack applications with Next.js',
  'nextjs',
  id,
  true
from public.categories where slug = 'web-development';

insert into public.subcategories (name, description, slug, category_id, featured)
select 
  'React Native',
  'Build native mobile apps with React Native',
  'react-native',
  id,
  true
from public.categories where slug = 'mobile-development';

insert into public.subcategories (name, description, slug, category_id, featured)
select 
  'Flutter Development',
  'Create beautiful cross-platform apps with Flutter',
  'flutter',
  id,
  true
from public.categories where slug = 'mobile-development';

insert into public.subcategories (name, description, slug, category_id, featured)
select 
  'iOS Development',
  'Build native iOS apps with Swift',
  'ios',
  id,
  false
from public.categories where slug = 'mobile-development';

insert into public.subcategories (name, description, slug, category_id, featured)
select 
  'Machine Learning',
  'Learn machine learning algorithms and applications',
  'machine-learning',
  id,
  true
from public.categories where slug = 'data-science';

insert into public.subcategories (name, description, slug, category_id, featured)
select 
  'Deep Learning',
  'Master neural networks and deep learning',
  'deep-learning',
  id,
  true
from public.categories where slug = 'data-science';

-- Add category_id to courses table
alter table public.courses 
add column category_id uuid references public.categories(id),
add column subcategory_id uuid references public.subcategories(id);
