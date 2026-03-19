-- ============================================================
-- DECA Prep Master — Database Schema
-- Run this in Supabase → SQL Editor → New Query → Run
-- ============================================================

-- 1. PROFILES (auto-created when user signs up)
create table if not exists public.profiles (
  id         uuid references auth.users on delete cascade primary key,
  full_name  text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. QUIZ SESSIONS
create table if not exists public.quiz_sessions (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references auth.users on delete cascade not null,
  started_at       timestamptz default now(),
  completed_at     timestamptz,
  total_questions  int not null default 0,
  correct_count    int not null default 0,
  score_pct        numeric(5,2),
  filter_ia        text,
  filter_level     text
);

alter table public.quiz_sessions enable row level security;

create policy "Users can manage own sessions"
  on public.quiz_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 3. QUESTION ATTEMPTS (one row per answer submitted)
create table if not exists public.question_attempts (
  id                 uuid default gen_random_uuid() primary key,
  session_id         uuid references public.quiz_sessions on delete cascade not null,
  user_id            uuid references auth.users on delete cascade not null,
  question_id        int not null,
  pi_code            text not null,
  instructional_area text not null,
  level              text not null,
  selected_answer    text not null,
  correct_answer     text not null,
  is_correct         boolean not null,
  created_at         timestamptz default now()
);

alter table public.question_attempts enable row level security;

create policy "Users can manage own attempts"
  on public.question_attempts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index for fast dashboard queries
create index if not exists idx_attempts_user_id  on public.question_attempts (user_id);
create index if not exists idx_attempts_pi_code  on public.question_attempts (user_id, pi_code);
create index if not exists idx_attempts_ia       on public.question_attempts (user_id, instructional_area);
create index if not exists idx_sessions_user_id  on public.quiz_sessions (user_id, completed_at desc);


-- 4. HELPER VIEW: per-PI accuracy (for the dashboard heatmap)
create or replace view public.pi_performance as
select
  user_id,
  pi_code,
  instructional_area,
  count(*)                                           as attempts,
  sum(case when is_correct then 1 else 0 end)        as correct,
  round(
    sum(case when is_correct then 1 else 0 end)::numeric
    / count(*) * 100, 1
  )                                                  as accuracy_pct
from public.question_attempts
group by user_id, pi_code, instructional_area;


-- 5. HELPER VIEW: per-instructional-area accuracy
create or replace view public.ia_performance as
select
  user_id,
  instructional_area,
  count(*)                                           as attempts,
  sum(case when is_correct then 1 else 0 end)        as correct,
  round(
    sum(case when is_correct then 1 else 0 end)::numeric
    / count(*) * 100, 1
  )                                                  as accuracy_pct
from public.question_attempts
group by user_id, instructional_area;
