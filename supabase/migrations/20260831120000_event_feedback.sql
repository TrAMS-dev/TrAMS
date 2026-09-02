-- Per-event feedback form.
--
-- Adds creator-defined feedback questions + an "open" toggle to Events, and a table
-- for anonymous feedback submissions.

alter table public."Events"
  add column if not exists feedback_questions jsonb not null default '[]'::jsonb,
  add column if not exists feedback_open boolean not null default false;

create table if not exists public."EventFeedback" (
  id bigint generated always as identity primary key,
  "eventId" bigint not null references public."Events"(id) on delete cascade,
  created_at timestamptz not null default now(),
  answers jsonb not null default '{}'::jsonb
);

create index if not exists "EventFeedback_eventId_idx"
  on public."EventFeedback" ("eventId");

alter table public."EventFeedback" enable row level security;

-- Anonymous submissions, mirroring the anon-insert pattern already used for
-- EventParticipants (the signup route inserts with the anon key server-side).
-- The API route (app/api/events/feedback) validates payloads and checks feedback_open.
drop policy if exists "EventFeedback anon insert" on public."EventFeedback";
create policy "EventFeedback anon insert" on public."EventFeedback"
  for insert to anon, authenticated
  with check (true);

-- Only signed-in (admin) users read submissions, same as the participants view.
drop policy if exists "EventFeedback authenticated read" on public."EventFeedback";
create policy "EventFeedback authenticated read" on public."EventFeedback"
  for select to authenticated
  using (true);
