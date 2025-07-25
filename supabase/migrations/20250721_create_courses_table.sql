CREATE TABLE IF NOT EXISTS courses (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  link TEXT NOT NULL,
  author TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'::text,
  submitted_by UUID NOT NULL,
  approved_at TIMESTAMPTZ NULL,
  approved_by UUID NULL,
  category_id UUID NULL,
  subcategory_id UUID NULL,
  CONSTRAINT courses_pkey PRIMARY KEY (id),
  CONSTRAINT courses_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES auth.users(id),
  CONSTRAINT courses_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT courses_subcategory_id_fkey FOREIGN KEY (subcategory_id) REFERENCES subcategories(id),
  CONSTRAINT courses_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES auth.users(id)
);

-- Create policy to allow any authenticated user to insert
create policy "Allow authenticated users to insert courses"
  on public.courses for insert
  to authenticated
  with check (true);

-- Create policy to allow users to view their own submitted courses
create policy "Users can view their own submitted courses"
  on public.courses for select
  to authenticated
  using (submitted_by = auth.uid());

-- Create policy to allow admins to view all courses
create policy "Admins can view all courses"
  on public.courses for select
  to authenticated
  using (
    exists (
      select 1
      from auth.users
      where auth.uid() = auth.users.id
      and auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create policy to allow admins to update course status
create policy "Admins can update course status"
  on public.courses for update
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
alter table public.courses enable row level security;
