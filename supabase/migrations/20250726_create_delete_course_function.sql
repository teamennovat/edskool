-- Function to delete a course
create or replace function delete_pending_course(course_id uuid)
returns void
security definer
language plpgsql
as $$
begin
  delete from courses
  where 
    id = course_id
    and status = 'pending'
    and exists (
      select 1
      from profiles
      where 
        profiles.id = auth.uid()
        and profiles.role = 'admin'
    );
end;
$$;
