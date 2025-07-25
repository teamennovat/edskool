-- Add sample blog categories
insert into blog_categories (name, slug, description)
values 
  ('Getting Started', 'getting-started', 'Essential guides and tutorials for beginners'),
  ('Tips & Tricks', 'tips-and-tricks', 'Helpful tips to enhance your learning experience'),
  ('Learning Paths', 'learning-paths', 'Structured learning paths for different subjects'),
  ('Study Techniques', 'study-techniques', 'Effective study methods and strategies'),
  ('EdTech News', 'edtech-news', 'Latest updates in educational technology');

-- Get the admin user ID (assuming the first user is admin)
do $$
declare
  admin_id uuid;
begin
  select id into admin_id from auth.users limit 1;

  -- Add sample blog posts
  insert into blog_posts (
    title,
    slug,
    excerpt,
    content,
    featured_image,
    published,
    published_at,
    author_id,
    category_id
  )
  values 
    (
      'Welcome to edskool: Your Learning Journey Starts Here',
      'welcome-to-edskool',
      'Begin your educational journey with edskool. Learn about our platform and how to make the most of your learning experience.',
      '## Welcome to edskool!

We''re excited to have you here. edskool is designed to make your learning journey both effective and enjoyable. In this post, we''ll walk you through the key features of our platform.

### Getting Started

1. Create your personal learning profile
2. Explore available courses
3. Join study groups
4. Track your progress

### Key Features

- Personalized learning paths
- Interactive course content
- Progress tracking
- Community support',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7',
      true,
      now(),
      admin_id,
      (select id from blog_categories where slug = 'getting-started')
    ),
    (
      '5 Effective Study Techniques for Online Learning',
      '5-effective-study-techniques',
      'Discover proven study techniques that can help you learn more effectively in an online environment.',
      '## Effective Study Techniques

Learning online requires different approaches than traditional classroom learning. Here are five techniques that can help you succeed:

### 1. The Pomodoro Technique

Study in focused 25-minute intervals with short breaks.

### 2. Active Recall

Test yourself instead of just re-reading materials.

### 3. Spaced Repetition

Review material at increasing intervals.

### 4. Mind Mapping

Create visual connections between concepts.

### 5. Teaching Others

Explain concepts to reinforce your understanding.',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
      true,
      now() - interval '1 day',
      admin_id,
      (select id from blog_categories where slug = 'study-techniques')
    ),
    (
      'The Future of AI in Education: 2025 Trends',
      'ai-in-education-2025-trends',
      'Explore how artificial intelligence is transforming education and what to expect in the coming years.',
      '## AI in Education

Artificial intelligence is revolutionizing how we learn and teach. Here are the key trends shaping education:

### Current Trends

1. Personalized Learning Paths
2. Intelligent Tutoring Systems
3. Automated Grading
4. Learning Analytics

### Future Developments

- AI-powered study assistants
- Virtual reality classrooms
- Adaptive learning systems
- Real-time feedback systems',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
      true,
      now() - interval '2 days',
      admin_id,
      (select id from blog_categories where slug = 'edtech-news')
    ),
    (
      'Building Your Perfect Learning Path',
      'building-perfect-learning-path',
      'Learn how to create a personalized learning path that aligns with your goals and learning style.',
      '## Creating Your Learning Path

A well-structured learning path is key to achieving your educational goals. Here''s how to create one:

### Steps to Success

1. Define your learning goals
2. Assess your current level
3. Choose appropriate courses
4. Set realistic milestones
5. Track your progress

### Tips for Success

- Start with fundamentals
- Progress gradually
- Regular self-assessment
- Adjust as needed',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
      true,
      now() - interval '3 days',
      admin_id,
      (select id from blog_categories where slug = 'learning-paths')
    ),
    (
      '10 Pro Tips for Online Learning Success',
      '10-pro-tips-online-learning',
      'Master online learning with these expert tips and strategies for success.',
      '## Pro Tips for Online Learning

Success in online learning requires the right approach and mindset. Here are our top tips:

### Essential Tips

1. Create a dedicated study space
2. Establish a routine
3. Use productivity tools
4. Take effective notes
5. Participate in discussions
6. Stay organized
7. Take regular breaks
8. Network with peers
9. Use multiple resources
10. Track your progress

### Implementation

Detailed strategies for each tip...',
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8',
      true,
      now() - interval '4 days',
      admin_id,
      (select id from blog_categories where slug = 'tips-and-tricks')
    );
end $$;
