-- Update policies for the courses table
create policy "Anyone can view approved courses"
    on "public"."courses"
    for select
    using (status = 'approved');

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

-- Grant permissions on the view
grant select on public.courses_with_submitter to anon;
grant select on public.courses_with_submitter to authenticated;

-- Create a function to get courses with submitter info
create or replace function public.get_courses_by_category(
    category_id_input uuid,
    subcategory_id_input uuid default null
)
returns setof public.courses_with_submitter
language plpgsql security definer
as $$
begin
    return query 
    select *
    from public.courses_with_submitter
    where 
        category_id = category_id_input
        and (subcategory_id_input is null or subcategory_id = subcategory_id_input);
end;
$$;

-- Grant execute permission on the function
grant execute on function public.get_courses_by_category to anon;
grant execute on function public.get_courses_by_category to authenticated;
