-- =============================================================================
-- Blog de Lupa Servicios Digitales: tablas, seguridad y almacenamiento de imágenes.
--
-- Todo lleva el prefijo "lupa_" (y el bucket "lupa-blog-images"), así se puede
-- correr en un proyecto de Supabase que ya tiene otras cosas (por ejemplo, el blog
-- de Iron Tower) sin tocar sus tablas, funciones ni imágenes.
--
-- Cómo usarlo: Supabase → SQL Editor → New query → pegar todo este archivo → Run.
-- Se puede correr más de una vez sin romper nada.
-- =============================================================================

-- Plantillas de artículo (estructura de bloques reutilizable).
create table if not exists public.lupa_post_templates (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 120),
  structure   jsonb not null default '{"rows": []}'::jsonb,
  created_at  timestamptz not null default now()
);

-- Artículos.
create table if not exists public.lupa_posts (
  id            uuid primary key default gen_random_uuid(),
  title         text not null check (char_length(title) between 1 and 200),
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  excerpt       text,
  content       text,                 -- artículos de texto libre (HTML)
  blocks        jsonb,                -- artículos con bloques ({ "_s": estructura, ...contenido })
  cover_image   text,
  tags          text[] not null default '{}',
  published     boolean not null default false,
  published_at  timestamptz,          -- se completa la primera vez que se publica
  template_id   uuid references public.lupa_post_templates (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists lupa_posts_published_idx on public.lupa_posts (published, published_at desc);
create index if not exists lupa_posts_tags_idx on public.lupa_posts using gin (tags);

-- updated_at automático.
create or replace function public.lupa_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists lupa_posts_set_updated_at on public.lupa_posts;
create trigger lupa_posts_set_updated_at
  before update on public.lupa_posts
  for each row execute function public.lupa_set_updated_at();

-- -----------------------------------------------------------------------------
-- Seguridad (Row Level Security)
-- La web pública usa la clave "publishable": solo puede LEER artículos publicados.
-- El panel /admin usa la clave "secret" desde el servidor, que no pasa por estas reglas.
-- Las plantillas no tienen ninguna regla pública: solo el panel puede verlas.
-- -----------------------------------------------------------------------------
alter table public.lupa_posts enable row level security;
alter table public.lupa_post_templates enable row level security;

drop policy if exists "Lupa: artículos publicados visibles para todos" on public.lupa_posts;
create policy "Lupa: artículos publicados visibles para todos"
  on public.lupa_posts
  for select
  to anon, authenticated
  using (published = true);

-- -----------------------------------------------------------------------------
-- Imágenes del blog: bucket público de solo lectura, hasta 5 MB por imagen.
-- Solo el panel (clave secret) puede subir o borrar.
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lupa-blog-images',
  'lupa-blog-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- =============================================================================
-- Usuarios del panel /admin (además del acceso de emergencia de las variables
-- de entorno ADMIN_EMAIL / ADMIN_PASSWORD). Las contraseñas se guardan cifradas.
-- =============================================================================
create table if not exists public.lupa_usuarios (
  id             uuid primary key default gen_random_uuid(),
  email          text not null unique check (email = lower(email) and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  nombre         text not null check (char_length(nombre) between 1 and 80),
  cargo          text check (char_length(cargo) <= 80),
  linkedin       text check (char_length(linkedin) <= 300),
  password_hash  text not null,
  activo         boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

drop trigger if exists lupa_usuarios_set_updated_at on public.lupa_usuarios;
create trigger lupa_usuarios_set_updated_at
  before update on public.lupa_usuarios
  for each row execute function public.lupa_set_updated_at();

-- Sin reglas públicas: solo el panel (clave secret) puede leer o escribir usuarios.
alter table public.lupa_usuarios enable row level security;

-- Autor de cada artículo. Nombre, cargo y link se copian al guardar para mostrarlos en el blog.
alter table public.lupa_posts add column if not exists author_id uuid references public.lupa_usuarios (id) on delete set null;
alter table public.lupa_posts add column if not exists author_name text;
alter table public.lupa_posts add column if not exists author_role text;
alter table public.lupa_posts add column if not exists author_url text;

-- =============================================================================
-- Consultas del formulario de contacto (bandeja del panel).
-- =============================================================================
create table if not exists public.lupa_consultas (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null check (char_length(nombre) between 1 and 120),
  empresa     text check (char_length(empresa) <= 120),
  rubro       text check (char_length(rubro) <= 120),
  whatsapp    text not null check (char_length(whatsapp) between 6 and 40),
  necesidad   text not null check (char_length(necesidad) <= 80),
  mensaje     text check (char_length(mensaje) <= 2000),
  pagina      text check (char_length(pagina) <= 300),   -- desde qué página escribió
  estado      text not null default 'nueva' check (estado in ('nueva', 'respondida', 'archivada')),
  notas       text check (char_length(notas) <= 4000),   -- notas internas
  ip_hash     text,                                      -- para frenar spam, sin guardar la IP
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists lupa_consultas_estado_idx on public.lupa_consultas (estado, created_at desc);
create index if not exists lupa_consultas_ip_idx on public.lupa_consultas (ip_hash, created_at desc);

drop trigger if exists lupa_consultas_set_updated_at on public.lupa_consultas;
create trigger lupa_consultas_set_updated_at
  before update on public.lupa_consultas
  for each row execute function public.lupa_set_updated_at();

-- Sin reglas públicas: las consultas entran por la API del sitio (clave secret) y solo se ven en el panel.
alter table public.lupa_consultas enable row level security;
