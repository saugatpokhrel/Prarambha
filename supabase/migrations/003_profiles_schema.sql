-- Create profiles table to track admin roles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text default 'user' check (role in ('user', 'admin')),
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table profiles enable row level security;

-- RLS Policies
-- Users can read their own profile
create policy "Users can read own profile" on profiles
  for select using (auth.uid() = id);

-- Users can update their own profile (but not role)
create policy "Users can update own profile" on profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins can read all profiles
create policy "Admins can read all profiles" on profiles
  for select
  using (
    (select role from profiles where id = auth.uid()) = 'admin'
  );

-- Admins can update any profile role
create policy "Admins can update profiles" on profiles
  for update
  using (
    (select role from profiles where id = auth.uid()) = 'admin'
  )
  with check (
    (select role from profiles where id = auth.uid()) = 'admin'
  );

-- Create function to auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger to create profile on auth user creation
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Index for performance
create index if not exists profiles_email_idx on profiles(email);
create index if not exists profiles_role_idx on profiles(role);
