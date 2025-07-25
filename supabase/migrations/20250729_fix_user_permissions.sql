-- Drop existing function if it exists
drop function if exists public.get_courses_by_category;

-- Create a secure view for courses with submitter info
create or replace view public.courses_with_submitter as
select 
    c.id,
    c.name,
    c.description,
    c.author,
    c.link,
    c.created_at,
    c.category_id,
    c.subcategory_id,
    c.status,
    jsonb_build_object(
        'id', p.id,
        'email', p.email
    ) as submitter
from public.courses c
left join public.profiles p on c.submitted_by = p.id
where c.status = 'approved';

-- Grant access to the view
grant select on public.courses_with_submitter to anon;
grant select on public.courses_with_submitter to authenticated;

-- Create a secure function to get courses by category
create or replace function public.get_courses_by_category(
    category_id_input uuid,
    subcategory_id_input uuid default null
)
returns setof public.courses_with_submitter
language sql
security definer 
set search_path = public
stable
as $$
    select *
    from public.courses_with_submitter
    where category_id = category_id_input
        and (subcategory_id_input is null or subcategory_id = subcategory_id_input)
    order by created_at desc;
$$;

-- Grant execute permission on the function
grant execute on function public.get_courses_by_category to anon;
grant execute on function public.get_courses_by_category to authenticated;

-- Update permissions for courses table
alter table public.courses enable row level security;

create policy "Anyone can view approved courses"
    on public.courses
    for select
    using (status = 'approved');

-- Update permissions for profiles table
alter table public.profiles enable row level security;

create policy "Anyone can view profiles"
    on public.profiles
    for select
    using (true);

-- Make sure profiles has the right permissions
grant select on public.profiles to anon;
grant select on public.profiles to authenticated;

-- Revoke direct access to auth.users
revoke select on auth.users from anon;
revoke select on auth.users from authenticated;
