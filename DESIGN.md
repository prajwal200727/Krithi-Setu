# DESIGN.md: KrishiSetu

## 1. Design Principles
- **Farmer-first & low-literacy-friendly:** Kannada by default, icons + labels, at most 5 fields per screen.
- **Mobile-first & low-bandwidth:** PWA, lightweight assets, minimal JS.
- **Transparency by default:** Every listing shows how it compares to public APMC Mandi prices.
- **Direct, no commission:** The platform directly introduces buyer and farmer without sitting in the payment flow (MVP).
- **Honest data:** Always show the data source, the market, and date. Never fabricate prices.

## 2. Information Architecture
- `/` - Landing & Produce discovery (public)
- `/login` - Phone OTP authentication (Farmer / Buyer role)
- `/browse` - Real-time produce discovery with crop, taluk, price & quantity filters
- `/listings/[id]` - Listing detail + Mandi fair price badge + 30-day Agmarknet trend chart
- `/prices` - Live Mandi price explorer (Puttur, Mangaluru, Udupi, Kundapura, Karkala, Sullia, etc.)
- `/farmer/new` - 60-second create listing flow with instant Mandi guidance chip
- `/farmer/listings` - Farmer produce management (edit, mark sold, delete)
- `/farmer/offers` - Incoming buyer offers (Accept, Counter, Decline) with contact reveal
- `/buyer/offers` - Buyer offers tracker with direct Call / WhatsApp connect on acceptance

## 3. Database Schema (Supabase / Postgres)
```sql
create table profiles (
  id uuid primary key,
  role text check (role in ('farmer','buyer')) not null,
  full_name text not null,
  phone text not null,
  district text check (district in ('Dakshina Kannada','Udupi')),
  taluk text,
  village text,
  language text default 'kn',
  business_name text,
  created_at timestamptz default now()
);

create table commodities (
  id serial primary key,
  slug text unique not null,
  name_en text not null,
  name_kn text not null,
  default_unit text not null,
  agmarknet_name text
);

create table markets (
  id serial primary key,
  name text not null,
  district text,
  state text default 'Karnataka',
  lat numeric, lng numeric
);

create table mandi_prices (
  id bigserial primary key,
  commodity_id int references commodities(id),
  market_id int references markets(id),
  variety text,
  arrival_date date not null,
  min_price numeric,
  max_price numeric,
  modal_price numeric,
  source text default 'agmarknet',
  fetched_at timestamptz default now(),
  unique (commodity_id, market_id, variety, arrival_date)
);

create table listings (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references profiles(id) on delete cascade,
  commodity_id int references commodities(id),
  variety text,
  quantity numeric not null check (quantity > 0),
  unit text not null,
  asking_price numeric not null,
  taluk text not null,
  village text,
  photo_url text,
  description text,
  available_until date,
  status text default 'active' check (status in ('active','sold','expired')),
  created_at timestamptz default now()
);

create table offers (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  buyer_id uuid references profiles(id),
  offered_price numeric not null,
  quantity numeric not null,
  note text,
  status text default 'pending' check (status in ('pending','accepted','countered','declined','withdrawn')),
  counter_price numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```
