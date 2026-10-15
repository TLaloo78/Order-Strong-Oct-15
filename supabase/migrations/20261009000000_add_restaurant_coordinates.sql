-- Map locations. Coordinates are sample positions around downtown Wheaton, IL
-- (consistent with each restaurant's mock distance_mi); the restaurants are fictional.
alter table public.restaurants
  add column latitude numeric(9, 6),
  add column longitude numeric(9, 6);

update public.restaurants as r
set latitude = v.latitude,
    longitude = v.longitude,
    neighborhood = v.neighborhood
from (values
  ('sunday-grounds',    41.866100, -88.099230, 'Downtown Wheaton'),
  ('ember-oak-grill',   41.877510, -88.109700, 'Main Street'),
  ('olive-branch',      41.857410, -88.086830, 'Glen Ellyn'),
  ('casa-marigold',     41.842930, -88.107000, 'Roosevelt Road'),
  ('lotus-table',       41.844590, -88.135830, 'Warrenville'),
  ('saffron-courtyard', 41.836150, -88.073310, 'Butterfield Road'),
  ('bamboo-street',     41.873640, -88.049650, 'Lombard'),
  ('prairie-pine',      41.897750, -88.157560, 'Winfield')
) as v (id, latitude, longitude, neighborhood)
where r.id = v.id;

alter table public.restaurants
  alter column latitude set not null,
  alter column longitude set not null,
  add constraint restaurants_latitude_range check (latitude between -90 and 90),
  add constraint restaurants_longitude_range check (longitude between -180 and 180);
