create or replace function get_blog_post_with_details(post_slug text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
    result jsonb;
begin
    select 
        jsonb_build_object(
            'post', jsonb_build_object(
                'id', p.id,
                'title', p.title,
                'slug', p.slug,
                'excerpt', p.excerpt,
                'content', p.content,
                'featured_image', p.featured_image,
                'published_at', p.published_at,
                'meta_title', p.meta_title,
                'meta_description', p.meta_description,
                'author', jsonb_build_object(
                    'id', p.author_id,
                    'email', coalesce(u.email, 'unknown'),
                    'name', coalesce(up.full_name, null)
                ),
                'category', jsonb_build_object(
                    'id', c.id,
                    'name', c.name,
                    'slug', c.slug,
                    'description', c.description
                )
            )
        ) into result
    from blog_posts p
    left join auth.users u on u.id = p.author_id
    left join profiles up on up.id = p.author_id
    left join blog_categories c on c.id = p.category_id
    where p.slug = post_slug
    and p.published = true;

    return result;
end;
$$;
