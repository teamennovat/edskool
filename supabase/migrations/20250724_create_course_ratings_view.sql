-- Drop the view if it exists
drop view if exists public.course_ratings;

-- Create the view with security_invoker and explicit schema references
create view public.course_ratings with (security_invoker = on) as
select 
    cr.course_id,
    round(avg(cr.rating)::numeric, 1)::text as average_rating,
    count(*)::integer as total_reviews
from public.course_reviews cr
inner join public.courses c on c.id = cr.course_id
group by cr.course_id;
