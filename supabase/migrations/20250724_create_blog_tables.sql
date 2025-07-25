-- Create blog categories table
create table public.blog_categories (
    id uuid not null default gen_random_uuid(),
    created_at timestamp with time zone not null default timezone('utc'::text, now()),
    name text not null,
    slug text not null,
    description text null,
    constraint blog_categories_pkey primary key (id),
    constraint blog_categories_slug_key unique (slug)
) tablespace pg_default;

-- Function to update blog post slugs (keeps special characters for SEO)
create or replace function update_blog_post_slug()
returns trigger
language plpgsql
as $$
declare
    base_slug text;
    temp_slug text;
    counter integer := 1;
begin
    -- Create SEO-friendly slug from title
    base_slug := lower(regexp_replace(new.title, '[^a-zA-Z0-9\s-]', '', 'g')); -- Remove special chars except spaces and hyphens
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g'); -- Replace spaces with hyphens
    base_slug := regexp_replace(base_slug, '-+', '-', 'g'); -- Replace multiple hyphens with single hyphen
    base_slug := trim(both '-' from base_slug); -- Remove leading/trailing hyphens
    
    -- Try the base slug first
    temp_slug := base_slug;
    
    -- If slug exists, append numbers until we find a unique one
    while exists (
        select 1 from blog_posts 
        where slug = temp_slug 
        and id != coalesce(new.id, uuid_nil())
    ) loop
        temp_slug := base_slug || '-' || counter;
        counter := counter + 1;
    end loop;
    
    new.slug := temp_slug;
    return new;
end;
$$;

-- Create blog posts table
create table public.blog_posts (
    id uuid not null default gen_random_uuid(),
    created_at timestamp with time zone not null default timezone('utc'::text, now()),
    updated_at timestamp with time zone not null default timezone('utc'::text, now()),
    title text not null,
    slug text not null,
    excerpt text null,
    content text not null,
    published boolean not null default false,
    published_at timestamp with time zone null,
    author_id uuid not null,
    category_id uuid null,
    featured_image text null,
    meta_title text null,
    meta_description text null,
    constraint blog_posts_pkey primary key (id),
    constraint blog_posts_slug_key unique (slug),
    constraint blog_posts_author_id_fkey foreign key (author_id) references auth.users(id),
    constraint blog_posts_category_id_fkey foreign key (category_id) references blog_categories(id)
) tablespace pg_default;

-- Enable RLS after ensuring tables exist
do $$
begin
    if exists (select from pg_tables where schemaname = 'public' and tablename = 'blog_posts') then
        alter table blog_posts enable row level security;
    end if;
    if exists (select from pg_tables where schemaname = 'public' and tablename = 'blog_categories') then
        alter table blog_categories enable row level security;
    end if;
end
$$;

-- RLS Policies for blog_posts
create policy "Public can view published blog posts"
    on blog_posts for select
    using (published = true);

create policy "Authors can update their own posts"
    on blog_posts for update
    using (auth.uid() = author_id);

create policy "Authors can delete their own posts"
    on blog_posts for delete
    using (auth.uid() = author_id);

create policy "Authenticated users can create posts"
    on blog_posts for insert
    with check (auth.role() = 'authenticated');

-- RLS Policies for blog_categories
create policy "Anyone can view categories"
    on blog_categories for select
    to public
    using (true);

create policy "Only authenticated users can create categories"
    on blog_categories for insert
    to authenticated
    with check (true);

-- Function to get blog post with details (respecting RLS)
create or replace function get_blog_post_with_details(post_slug text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
    select 
        jsonb_build_object(
            'post', jsonb_build_object(
                'id', p.id,
                'title', p.title,
                'slug', p.slug,
                'excerpt', p.excerpt,
                'content', p.content,
                'published', p.published,
                'published_at', p.published_at,
                'created_at', p.created_at,
                'updated_at', p.updated_at,
                'featured_image', p.featured_image,
                'meta_title', p.meta_title,
                'meta_description', p.meta_description,
                'category', (
                    select jsonb_build_object(
                        'id', c.id,
                        'name', c.name,
                        'slug', c.slug,
                        'description', c.description
                    )
                    from blog_categories c
                    where c.id = p.category_id
                ),
                'author', (
                    select jsonb_build_object(
                        'id', u.id,
                        'email', u.email,
                        'name', up.full_name
                    )
                    from auth.users u
                    left join public.profiles up on u.id = up.id
                    where u.id = p.author_id
                )
            )
        )
    from blog_posts p
    where p.slug = post_slug
    and p.published = true;
$$;

-- Function to list blog posts with pagination (respecting RLS)
create or replace function list_blog_posts(
    page_number integer default 1,
    page_size integer default 10,
    category_slug text default null
)
returns table (
    posts jsonb,
    total_count bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
    total bigint;
begin
    -- Get total count of filtered posts
    select count(*)
    into total
    from blog_posts p
    where p.published = true
    and (
        category_slug is null or 
        exists (
            select 1 from blog_categories c
            where c.id = p.category_id
            and c.slug = category_slug
        )
    );

    -- Return the results
    return query
    with filtered_posts as (
        select
            p.id,
            p.title,
            p.slug,
            p.excerpt,
            p.featured_image,
            p.published_at,
            jsonb_build_object(
                'id', c.id,
                'name', c.name,
                'slug', c.slug,
                'description', c.description
            ) as category,
            jsonb_build_object(
                'id', u.id,
                'email', u.email,
                'name', up.full_name
            ) as author
        from blog_posts p
        left join blog_categories c on c.id = p.category_id
        left join auth.users u on u.id = p.author_id
        left join public.profiles up on up.id = p.author_id
        where p.published = true
        and (
            category_slug is null or 
            exists (
                select 1 from blog_categories c2
                where c2.id = p.category_id
                and c2.slug = category_slug
            )
        )
        order by p.published_at desc nulls last, p.created_at desc
        limit page_size
        offset ((page_number - 1) * page_size)
    )
    select
        jsonb_build_object(
            'posts', jsonb_build_object(
                'items', coalesce(
                    jsonb_agg(
                        jsonb_build_object(
                            'id', fp.id,
                            'title', fp.title,
                            'slug', fp.slug,
                            'excerpt', fp.excerpt,
                            'featured_image', fp.featured_image,
                            'published_at', fp.published_at,
                            'category', fp.category,
                            'author', fp.author
                        )
                    ),
                    '[]'::jsonb
                ),
                'page', page_number,
                'pageSize', page_size,
                'totalPages', ceil(total::numeric / page_size)
            )
        ),
        total
    from filtered_posts fp;
end;
$$;

-- Grant necessary permissions (minimal required access)
do $$
begin
    -- Grant schema usage
    grant usage on schema public to anon, authenticated;
    grant usage on schema auth to anon, authenticated;

    -- Grant table permissions if they exist
    if exists (select from pg_tables where schemaname = 'public' and tablename = 'blog_posts') then
        grant select on public.blog_posts to anon, authenticated;
        grant insert, update, delete on public.blog_posts to authenticated;
    end if;

    if exists (select from pg_tables where schemaname = 'public' and tablename = 'blog_categories') then
        grant select on public.blog_categories to anon, authenticated;
        grant insert on public.blog_categories to authenticated;
    end if;

    -- Grant auth table permissions
    grant select on auth.users to anon, authenticated;

    -- Grant function permissions if they exist
    if exists (select from pg_proc where proname = 'get_blog_post_with_details') then
        grant execute on function public.get_blog_post_with_details(text) to anon, authenticated;
    end if;

    if exists (select from pg_proc where proname = 'list_blog_posts') then
        grant execute on function public.list_blog_posts(integer, integer, text) to anon, authenticated;
    end if;

    -- Grant permissions for the trigger function
    grant execute on function public.update_blog_post_slug() to anon, authenticated;
end
$$;

-- Create indexes
create index if not exists blog_posts_published_idx on public.blog_posts using btree (published) tablespace pg_default
where (published = true);

create index if not exists blog_posts_author_id_idx on public.blog_posts using btree (author_id) tablespace pg_default;

create index if not exists blog_posts_category_id_idx on public.blog_posts using btree (category_id) tablespace pg_default;

create index if not exists blog_posts_published_at_idx on public.blog_posts using btree (published_at desc nulls last) tablespace pg_default;

-- Function to update blog post slugs (keeps special characters for SEO)
create or replace function update_blog_post_slug()
returns trigger
language plpgsql
as $$
declare
    base_slug text;
    temp_slug text;
    counter integer := 1;
begin
    -- Create SEO-friendly slug from title
    base_slug := lower(regexp_replace(new.title, '[^a-zA-Z0-9\s-]', '', 'g')); -- Remove special chars except spaces and hyphens
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g'); -- Replace spaces with hyphens
    base_slug := regexp_replace(base_slug, '-+', '-', 'g'); -- Replace multiple hyphens with single hyphen
    base_slug := trim(both '-' from base_slug); -- Remove leading/trailing hyphens
    
    -- Try the base slug first
    temp_slug := base_slug;
    
    -- If slug exists, append numbers until we find a unique one
    while exists (
        select 1 from blog_posts 
        where slug = temp_slug 
        and id != coalesce(new.id, uuid_nil())
    ) loop
        temp_slug := base_slug || '-' || counter;
        counter := counter + 1;
    end loop;
    
    new.slug := temp_slug;
    return new;
end;
$$;

-- Trigger for updating blog post slugs
create trigger set_blog_post_slug
before insert or update of title on blog_posts
for each row
execute function update_blog_post_slug();
