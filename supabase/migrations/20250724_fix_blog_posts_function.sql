-- First drop the existing function
drop function if exists list_blog_posts(integer, integer, text);

create function list_blog_posts(
    page_number integer default 1,
    page_size integer default 10,
    category_slug text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
    total bigint;
    result jsonb;
begin
    -- Validate input parameters
    if page_number < 1 then
        page_number := 1;
    end if;
    
    if page_size < 1 then
        page_size := 10;
    end if;

    -- Check if category exists when category_slug is provided
    if category_slug is not null then
        if not exists (
            select 1 from blog_categories 
            where slug = category_slug
        ) then
            return jsonb_build_object(
                'posts', jsonb_build_object(
                    'items', '[]'::jsonb,
                    'page', page_number,
                    'pageSize', page_size,
                    'totalPages', 0
                )
            );
        end if;
    end if;

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

    -- Return empty result if no posts found
    if total = 0 then
        return jsonb_build_object(
            'posts', jsonb_build_object(
                'items', '[]'::jsonb,
                'page', page_number,
                'pageSize', page_size,
                'totalPages', 0
            )
        );
    end if;

    -- Get posts with author and category information
    with filtered_posts as (
        select
            p.id,
            p.title,
            p.slug,
            p.excerpt,
            p.featured_image,
            p.published_at,
            coalesce(
                jsonb_build_object(
                    'id', c.id,
                    'name', c.name,
                    'slug', c.slug,
                    'description', c.description
                ),
                '{}'::jsonb
            ) as category,
            jsonb_build_object(
                'id', p.author_id,
                'email', coalesce(u.email, 'unknown'),
                'name', coalesce(up.full_name, null)
            ) as author
        from blog_posts p
        left join blog_categories c on c.id = p.category_id
        left join auth.users u on u.id = p.author_id
        left join profiles up on up.id = p.author_id
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
                'totalPages', greatest(1, ceil(total::numeric / page_size))
            )
        )
    into result
    from filtered_posts fp;

    return coalesce(result, 
        jsonb_build_object(
            'posts', jsonb_build_object(
                'items', '[]'::jsonb,
                'page', page_number,
                'pageSize', page_size,
                'totalPages', 0
            )
        )
    );
end;
$$;

-- Grant execute permission
grant execute on function public.list_blog_posts(integer, integer, text) to anon, authenticated;
