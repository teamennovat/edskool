-- Drop any remaining references to blog_posts_categories table
do $$
begin
    -- Drop function if it exists with old signature
    if exists (select from pg_proc where proname = 'list_blog_posts' and pronargs = 4) then
        drop function if exists list_blog_posts(integer, integer, text, text);
    end if;

    -- Clean up any views that might reference the old tables
    drop view if exists blog_posts_with_categories cascade;
    drop view if exists blog_posts_with_tags cascade;
    
    -- Drop old tables if they still exist
    drop table if exists blog_posts_categories cascade;
    drop table if exists blog_posts_tags cascade;
    drop table if exists blog_tags cascade;
end;
$$;
