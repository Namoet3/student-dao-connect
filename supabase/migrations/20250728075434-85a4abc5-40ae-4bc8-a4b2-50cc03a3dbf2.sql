-- Create projects table
create table public.projects (
  id          uuid primary key default uuid_generate_v4(),
  owner_id    uuid references auth.users(id),
  title       text not null,
  description text not null,
  budget_min  numeric,
  budget_max  numeric,
  status      text default 'open', -- open|active|completed
  created_at  timestamptz default now()
);

-- Create applications table
create table public.applications (
  id            uuid primary key default uuid_generate_v4(),
  project_id    uuid references public.projects(id),
  applicant_id  uuid references auth.users(id),
  cover_letter  text,
  status        text default 'pending', -- pending|accepted|rejected
  created_at    timestamptz default now()
);

-- Enable Row-Level Security for projects
alter table public.projects enable row level security;

-- Create policy for project owners
create policy "owner can manage project"
  on public.projects for all
  using ( auth.uid() = owner_id );

-- Enable Row-Level Security for applications
alter table public.applications enable row level security;

-- Create policy for applicants to manage their own applications
create policy "applicant can manage own application"
  on public.applications for all
  using ( auth.uid() = applicant_id );

-- Create policy for project owners to read applications
create policy "project owner can read applications"
  on public.applications for select
  using ( auth.uid() = (select owner_id from public.projects p where p.id = project_id) );