-- Restaurants and dishes for the protein-first recommender.
-- Public, read-only catalog data: anyone can read, nobody can write through the Data API.

create table public.restaurants (
  id text primary key,
  name text not null,
  cuisine text not null
    check (cuisine in ('Grill', 'Mediterranean', 'Mexican', 'Asian', 'Café', 'Steakhouse')),
  price_level smallint not null check (price_level between 1 and 3),
  entree_min_price numeric(6, 2) not null check (entree_min_price >= 0),
  entree_max_price numeric(6, 2) not null,
  distance_mi numeric(4, 1) not null check (distance_mi >= 0),
  neighborhood text not null,
  blurb text not null default '',
  created_at timestamptz not null default now(),
  check (entree_max_price >= entree_min_price)
);

create table public.dishes (
  id text primary key,
  restaurant_id text not null references public.restaurants (id) on delete cascade,
  name text not null,
  description text not null default '',
  price numeric(6, 2) not null check (price > 0),
  protein_min_g smallint not null check (protein_min_g >= 0),
  protein_max_g smallint not null,
  protein_confidence text not null check (protein_confidence in ('high', 'medium', 'low')),
  customization_tip text not null default '',
  customizations text[] not null default '{}',
  why_estimate text not null default '',
  created_at timestamptz not null default now(),
  check (protein_max_g >= protein_min_g)
);

create index dishes_restaurant_id_idx on public.dishes (restaurant_id);

alter table public.restaurants enable row level security;
alter table public.dishes enable row level security;

create policy "Restaurants are publicly readable"
  on public.restaurants for select
  to anon, authenticated
  using (true);

create policy "Dishes are publicly readable"
  on public.dishes for select
  to anon, authenticated
  using (true);

-- Read-only access for the Data API. No insert/update/delete policies exist, so writes are denied.
revoke all on public.restaurants, public.dishes from anon, authenticated;
grant select on public.restaurants, public.dishes to anon, authenticated;
