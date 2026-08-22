INSERT INTO hotels (id, slug, name, place, region, phone, email, rating, from_rate_paise)
VALUES
  (
    'madhapur',
    'madhapur',
    'Elysium Studio Suites',
    'Madhapur',
    'Madhapur, Hyderabad',
    '+91 98887 65776',
    'elysium.hyd@gmail.com',
    4.7,
    420000
  ),
  (
    'hitec',
    'hitec-city',
    'Elysium Premier Suites',
    'Hitec City',
    'Hitec City, Hyderabad',
    '+91 98887 65554',
    'elysium.hyd@gmail.com',
    4.8,
    560000
  )
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  place = EXCLUDED.place,
  region = EXCLUDED.region,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  rating = EXCLUDED.rating,
  from_rate_paise = EXCLUDED.from_rate_paise;

INSERT INTO suites (
  hotel_id,
  name,
  display_index,
  size_label,
  capacity_label,
  view_label,
  rate_paise
)
VALUES
  ('madhapur', 'Deluxe Studio', '01', '280 sq ft', '2 guests', 'City', 420000),
  ('madhapur', 'Studio Suite', '02', '420 sq ft', '3 guests', 'City', 540000),
  ('madhapur', 'One Bedroom Suite', '03', '610 sq ft', '4 guests', 'City', 760000),
  ('madhapur', 'Family Studio', '04', '560 sq ft', '4 guests', 'City', 680000),
  ('madhapur', 'Long Stay Apartment', '05', '700 sq ft', '4 guests', 'City / balcony', 890000),
  ('hitec', 'Premier Studio', '01', '340 sq ft', '2 guests', 'City / balcony', 560000),
  ('hitec', 'Premier One Bedroom', '02', '720 sq ft', '4 guests', 'City', 840000),
  ('hitec', 'Premier Family Suite', '03', '980 sq ft', '5 guests', 'City / two balconies', 1190000),
  ('hitec', 'Executive Corner Suite', '04', '640 sq ft', '3 guests', 'Corner / city', 940000),
  ('hitec', 'Two Bedroom Residence', '05', '1,180 sq ft', '6 guests', 'City / two balconies', 1450000)
ON CONFLICT (hotel_id, name) DO UPDATE SET
  display_index = EXCLUDED.display_index,
  size_label = EXCLUDED.size_label,
  capacity_label = EXCLUDED.capacity_label,
  view_label = EXCLUDED.view_label,
  rate_paise = EXCLUDED.rate_paise;
