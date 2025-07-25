-- Create feedback table
create table public.feedback (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    content text not null,
    status text check (status in ('new', 'read', 'archived')) default 'new',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create contact messages table
create table public.contact_messages (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text not null,
    subject text not null,
    message text not null,
    status text check (status in ('unread', 'read', 'replied', 'archived')) default 'unread',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS policies
alter table public.feedback enable row level security;
alter table public.contact_messages enable row level security;

-- Users can insert their own feedback
create policy "Users can insert their own feedback"
on public.feedback for insert
to authenticated
with check (auth.uid() = user_id);

-- Users can view their own feedback
create policy "Users can view their own feedback"
on public.feedback for select
to authenticated
using (auth.uid() = user_id);

-- Anyone can insert contact messages
create policy "Anyone can insert contact messages"
on public.contact_messages for insert
to public
with check (true);

-- Only admins can view contact messages
create policy "Admins can view all contact messages"
on public.contact_messages for select
to authenticated
using (
    exists (
        select 1 from public.profiles
        where id = auth.uid()
        and role = 'admin'
    )
);
