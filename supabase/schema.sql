-- Supabase PostgreSQL schema for Mayur Poshak

create table if not exists public.users (
  id uuid primary key default auth.uid(),
  email text not null unique,
  role text not null default 'user',
  blocked boolean not null default false,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id bigint generated always as identity primary key,
  name text not null unique,
  slug text not null unique,
  parent_id bigint references public.categories(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists categories_parent_idx on public.categories(parent_id);

create table if not exists public.brands (
  id bigint generated always as identity primary key,
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  category_id bigint not null references public.categories(id) on delete restrict,
  brand_id bigint references public.brands(id) on delete set null,
  base_price numeric(12,2) not null,
  image text,
  discount_percentage numeric(5,2) default 0,
  currency text not null default 'INR',
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_brand_idx on public.products(brand_id);
create index if not exists products_price_idx on public.products(base_price);
create index if not exists products_active_idx on public.products(is_active);
create index if not exists products_featured_idx on public.products(is_featured);

create table if not exists public.product_images (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  image_url text not null,
  public_id text,
  position int not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists product_images_product_idx on public.product_images(product_id);

create table if not exists public.product_variants (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  sku text unique,
  size text,
  color text,
  stock int not null default 0,
  price_override numeric(12,2),
  created_at timestamptz not null default now()
);
create index if not exists variants_product_idx on public.product_variants(product_id);
create index if not exists variants_stock_idx on public.product_variants(stock);

create table if not exists public.addresses (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'IN',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists addresses_user_idx on public.addresses(user_id);
create index if not exists addresses_default_idx on public.addresses(is_default);

create table if not exists public.coupons (
  id bigint generated always as identity primary key,
  code text not null unique,
  discount_type text not null check (discount_type in ('percentage','fixed')),
  discount_value numeric(10,2) not null,
  min_order_value numeric(12,2) default 0,
  max_uses int default 0,
  used_count int not null default 0,
  is_active boolean not null default true,
  expiry_date timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists coupons_active_idx on public.coupons(is_active);
create index if not exists coupons_expires_idx on public.coupons(expiry_date);

create table if not exists public.orders (
  id bigint generated always as identity primary key,
  user_id uuid references public.users(id) on delete set null,
  address_id bigint references public.addresses(id) on delete set null,
  status text not null default 'pending', -- pending, paid, shipped, delivered, cancelled
  total_amount numeric(12,2) not null default 0,
  coupon_id bigint references public.coupons(id),
  external_order_id text,
  external_payment_id text,
  created_at timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_idx on public.orders(created_at);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  product_id text not null,
  variant_id bigint references public.product_variants(id),
  quantity int not null check (quantity > 0),
  price numeric(12,2) not null,
  created_at timestamptz not null default now()
);
create index if not exists order_items_order_idx on public.order_items(order_id);
create index if not exists order_items_product_idx on public.order_items(product_id);

create table if not exists public.reviews (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  product_id text not null,
  rating int not null check (rating between 1 and 5),
  title text,
  comment text,
  images text[] default '{}',
  is_verified_purchase boolean not null default false,
  created_at timestamptz not null default now()
);
create unique index if not exists reviews_user_product_unique on public.reviews(user_id, product_id);
create index if not exists reviews_product_idx on public.reviews(product_id);

create table if not exists public.wishlist (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  product_id text not null,
  created_at timestamptz not null default now()
);
create unique index if not exists wishlist_user_product_unique on public.wishlist(user_id, product_id);

create table if not exists public.carts (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  updated_at timestamptz not null default now()
);
create unique index if not exists carts_user_unique on public.carts(user_id);

create table if not exists public.cart_items (
  id bigint generated always as identity primary key,
  cart_id bigint not null references public.carts(id) on delete cascade,
  product_id text not null,
  variant_id bigint references public.product_variants(id),
  quantity int not null check (quantity > 0),
  created_at timestamptz not null default now()
);
create index if not exists cart_items_cart_idx on public.cart_items(cart_id);

-- RPC: total_sales (sum of paid orders)
create or replace function public.total_sales()
returns numeric
language sql stable
as $$
  select coalesce(sum(total_amount), 0) from public.orders where status = 'paid';
$$;

-- Trigger to create a user entry in public.users on auth signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
