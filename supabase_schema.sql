-- CREATE PROFILES TABLE
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CREATE ANALYSES TABLE
create table analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  activity text not null,
  feedback text,
  form_quality text,
  power_score float8,
  joint_angles jsonb,
  jump_height float8,
  video_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SET UP ROW LEVEL SECURITY (RLS)
alter table profiles enable row level security;
alter table analyses enable row level security;

-- PROFILES POLICIES
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

-- ANALYSES POLICIES
create policy "Analyses are viewable by owner"
  on analyses for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own analyses"
  on analyses for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own analyses"
  on analyses for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own analyses"
  on analyses for delete
  using ( auth.uid() = user_id );

-- Handle new user signup to create profile automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
