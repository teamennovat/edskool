-- Create course reviews table
create table public.course_reviews (
    id uuid default uuid_generate_v4() primary key,
    course_id uuid not null references public.courses(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    -- Ensure one review per user per course
    constraint unique_user_course_review unique (user_id, course_id)
);

-- Create trigger to update updated_at column
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger set_updated_at
    before update on public.course_reviews
    for each row
    execute procedure public.handle_updated_at();

-- Add indexes for better query performance
create index course_reviews_course_id_idx on public.course_reviews(course_id);
create index course_reviews_user_id_idx on public.course_reviews(user_id);

-- Create a secure view for course reviews with user info
create or replace view public.course_reviews_with_user as
select 
    cr.id,
    cr.course_id,
    cr.rating,
    cr.comment,
    cr.created_at,
    cr.updated_at,
    jsonb_build_object(
        'id', p.id,
        'email', p.email
    ) as reviewer
from public.course_reviews cr
join public.profiles p on cr.user_id = p.id;

-- Create function to get average rating for a course
create or replace function public.get_course_rating(course_id_input uuid)
returns table (
    average_rating numeric,
    total_reviews bigint
) 
language plpgsql
security definer
as $$
begin
    return query
    select 
        round(avg(rating)::numeric, 1) as average_rating,
        count(*) as total_reviews
    from public.course_reviews
    where course_id = course_id_input;
end;
$$;

-- Create function to get reviews for a course
create or replace function public.get_course_reviews(course_id_input uuid)
returns setof public.course_reviews_with_user
language plpgsql
security definer
as $$
begin
    return query
    select *
    from public.course_reviews_with_user
    where course_id = course_id_input
    order by created_at desc;
end;
$$;

-- Set up Row Level Security (RLS)
alter table public.course_reviews enable row level security;

-- Policies for course_reviews table
create policy "Anyone can view course reviews"
    on public.course_reviews
    for select
    using (true);

create policy "Authenticated users can create reviews"
    on public.course_reviews
    for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
    on public.course_reviews
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own reviews"
    on public.course_reviews
    for delete
    to authenticated
    using (auth.uid() = user_id);

-- Grant permissions
grant select on public.course_reviews to anon;
grant select on public.course_reviews to authenticated;
grant insert, update, delete on public.course_reviews to authenticated;

grant select on public.course_reviews_with_user to anon;
grant select on public.course_reviews_with_user to authenticated;

grant execute on function public.get_course_rating to anon;
grant execute on function public.get_course_rating to authenticated;

grant execute on function public.get_course_reviews to anon;
grant execute on function public.get_course_reviews to authenticated;
