-- Reserved spots per kull ("pools"). Each entry is { "kull": <two-digit kull>, "spots": <int> }.
-- Spots not covered by a pool (max_attendees - sum of pool spots) are open to every allowed kull.
alter table public."Events"
    add column if not exists kull_pools jsonb not null default '[]'::jsonb;

alter table public."Events"
    add constraint "Events_kull_pools_is_array" check (jsonb_typeof(kull_pools) = 'array');
