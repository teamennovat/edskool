import { MetadataRoute } from "next";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerComponentClient({ cookies });
  
  console.log('Starting sitemap generation...');

  // Fetch all courses with just the slug field
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('slug')
    .order('created_at', { ascending: false });

  if (coursesError) {
    console.error('Error fetching courses:', coursesError);
  } else {
    console.log('Courses slugs:', courses?.map(c => c.slug));
  }
  console.log('Fetched courses:', courses?.length || 0, 'courses');

  // Fetch blog posts with just the slug field
  const { data: blogPosts, error: blogError } = await supabase
    .from('blog_posts')
    .select('slug')
    .order('created_at', { ascending: false });

  if (blogError) {
    console.error('Error fetching blog posts:', blogError);
  } else {
    console.log('Blog post slugs:', blogPosts?.map(p => p.slug));
  }
  console.log('Fetched blog posts:', blogPosts?.length || 0, 'posts');

  // Fetch categories
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, slug');

  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError);
  }
  console.log('Fetched categories:', categories?.length || 0, 'categories');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://edskool.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Create course routes
  console.log('Raw courses data:', courses); // Log raw data

  const courseRoutes = (courses || []).map((course) => {
    const route = {
      url: `${baseUrl}/courses/${course.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    };
    console.log('Generated course route:', route); // Log each route
    return route;
  });

  console.log('Generated course routes:', courseRoutes.length);

  // Create blog routes
  console.log('Raw blog posts data:', blogPosts); // Log raw data

  const blogRoutes = (blogPosts || []).map((post) => {
    const route = {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
    console.log('Generated blog route:', route); // Log each route
    return route;
  });

  // Create category routes
  const categoryRoutes = (categories || []).map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const allRoutes = [
    ...staticRoutes,
    ...courseRoutes,
    ...blogRoutes,
    ...categoryRoutes,
  ];

  console.log('Static routes:', staticRoutes.length);
  console.log('Course routes:', courseRoutes.length);
  console.log('Blog routes:', blogRoutes.length);
  console.log('Category routes:', categoryRoutes.length);
  console.log('Total routes in sitemap:', allRoutes.length);
  console.log('Final sitemap data:', allRoutes);
  
  return allRoutes;
}
