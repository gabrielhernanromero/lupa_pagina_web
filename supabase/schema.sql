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
