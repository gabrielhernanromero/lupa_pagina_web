# Lupa Servicios Digitales: sitio web

Home de una sola página (con anclas) para **Lupa Servicios Digitales**, más un **blog con panel propio** para escribir y publicar artículos. Objetivo único: que el visitante escriba por WhatsApp o complete el formulario.

**Producción:** https://lupaserviciosdigitales.com

## Stack

- **Next.js 16** (App Router, 100 % estático) + **React 19** + **TypeScript**
- **Tailwind CSS 3** + componentes estilo **shadcn/ui** (Radix): Sheet, Tabs, Button, Input y Textarea
- **Framer Motion** (aparición al scrollear, carga diferida con `LazyMotion`)
- **lucide-react** (íconos)
- **@next/third-parties** (Google Analytics 4)
- Blog: **Supabase** (base de datos + imágenes), **Auth.js / NextAuth v5** (login del panel), **TipTap** (editor de texto) y **dnd-kit** (editor de bloques)
- Deploy en **Vercel**

## Cómo correrlo

Requiere Node 20.9 o superior.

```bash
npm install
cp .env.example .env.local   # completar NEXT_PUBLIC_GA_ID si se quiere medir en local
npm run dev                  # http://localhost:3000
```

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (todas las rutas salen estáticas) |
| `npm run start` | Sirve el build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Chequeo de tipos |
| `npm run generate:firma` | Regenera `public/firma/logo-firma.png` |

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp Business de Lupa en formato wa.me (`5491172634803` = 11 7263-4803). Si no está, se usa ese mismo por defecto. El número visible del sitio se arma solo a partir de este. |
| `NEXT_PUBLIC_GA_ID` | ID de GA4 (`G-XXXXXXXXXX`). Si está vacío, GA no se carga. |
| `SUPABASE_URL` | URL del proyecto de Supabase del blog. |
| `SUPABASE_PUBLISHABLE_KEY` | Clave *publishable* (o *anon* en proyectos viejos). Solo puede leer artículos publicados. |
| `SUPABASE_SECRET_KEY` | Clave *secret* (o *service_role*). **Secreta**: solo la usa el servidor detrás del login. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Acceso de emergencia al panel `/admin`. El equipo entra con sus propios usuarios (ver *Usuarios*). |
| `AUTH_SECRET` | Firma de la sesión del panel. Se genera con `openssl rand -base64 32`. |
| `SMTP_PASS` | Opcional. Contraseña de contacto@ para que cada consulta nueva llegue por mail (Hostinger). Sin esto, las consultas igual quedan en el panel. |

Sin las variables de Supabase el sitio funciona igual: el blog se muestra vacío y el panel avisa que falta conectarlo.

En Vercel: *Project → Settings → Environment Variables*.

## Dónde se edita cada cosa

**Ningún texto, precio ni dato de contacto está escrito dentro de los componentes.** Los artículos del blog se escriben desde `/admin`; el resto vive en:

| Archivo | Contenido |
| --- | --- |
| `src/config/site.ts` | Nombre, dominio, WhatsApp, email, redes, mensajes de WhatsApp y menú |
| `src/data/planes.ts` | Planes por categoría, notas de cada tab, extras y línea de vigencia de precios |
| `src/data/servicios.ts` | Los 4 pilares de servicio |
| `src/data/paginas-servicios.ts` | Contenido de las páginas `/servicios/...` |
| `src/data/faq.ts` | Preguntas frecuentes (alimenta el acordeón **y** el JSON-LD `FAQPage`) |
| `src/data/casos.ts` | Casos de clientes y la frase de la franja de confianza |
| `src/data/home.ts` | Problemas, pasos del proceso, beneficios, equipo y opciones del formulario |

Al cambiar precios o planes se actualizan solos la página, el JSON-LD (`OfferCatalog`) y `/llms.txt`.

Formato de precios: `Intl.NumberFormat('es-AR', ARS)`. `mostrarPrecio: false` muestra "Consultar", `precio: null` muestra "A cotizar" y los planes mensuales llevan "/mes".

## Estructura

```
src/
  app/
    (site)/               Web pública (header, footer y botón de WhatsApp)
      page.tsx            Home (secciones + JSON-LD)
      blog/               Listado y artículos (+ imagen para redes de cada artículo)
      privacidad/         Política de privacidad
    admin/                Panel: login, artículos y plantillas
    api/                  posts, templates, upload y auth (solo para el panel)
    layout.tsx            Fuentes y metadata base
    not-found.tsx         404 propia
    sitemap.ts · robots.ts · llms.txt/route.ts
    opengraph-image.tsx · twitter-image.tsx · apple-icon.tsx · icon.svg
  proxy.ts                Redirige /admin al login si no hay sesión
  components/
    layout/      Header, footer, menú mobile, botón flotante y SiteShell
    sections/    Una sección de la home por archivo
    blog/        Cards, listado, encabezado, compartir y bloques del artículo
    admin/       Editor, editor de bloques, subida de imágenes y plantillas
    ui/          Componentes base (shadcn/ui)
    motion/      Reveal (aparición al scrollear)
    brand/       Logo, gradientes e íconos
  config/site.ts
  data/
  lib/
    blog/        Supabase, consultas, validación, limpieza de HTML, bloques y plantillas
    auth.ts      Login del panel
    whatsapp.ts, format.ts, analytics.ts, jsonld.ts, og.tsx
supabase/schema.sql      Tablas y reglas de la base del blog
scripts/generate-firma.mjs
public/firma/logo-firma.png   Logo para la firma de mail (600×180, usar a 300×90)
```

## Blog y panel `/admin`

- **Blog público:** `/blog` (listado con filtro por etiqueta) y `/blog/[slug]` (artículo). Las páginas son estáticas y se regeneran solas al guardar desde el panel.
- **Panel:** `/admin` (pide login). Desde ahí se crean, editan, publican, pasan a borrador y borran artículos.
- **Dos formas de escribir:**
  - *Texto libre:* editor con formato (títulos, listas, links, imágenes, citas).
  - *Con bloques:* portada, texto, texto + imagen, galería, carrusel, resultados, video, antes/después, testimonio y ficha del proyecto, con vista previa en vivo. Hay 10 plantillas prediseñadas y se pueden guardar plantillas propias.
- **Escribir con IA:** el panel trae un prompt listo para ChatGPT, Claude o Gemini. Se pega la respuesta y completa título, URL, resumen, etiquetas y texto.
- Las fotos se achican y pasan a WebP en el navegador antes de subirse (máx. 2000 px).
- Cada artículo tiene su imagen para redes con el título, JSON-LD `BlogPosting` + `BreadcrumbList`, y entra solo al `sitemap.xml` y a `/llms.txt`.

### Puesta en marcha (una sola vez)

**Hoy el blog vive en el proyecto `irontowerblog`** (compartido con el blog de Iron Tower) y sus variables ya están cargadas en Vercel para Production y Preview.

Todo lo del blog en Supabase lleva el prefijo `lupa_` (tablas `lupa_posts` y `lupa_post_templates`, bucket `lupa-blog-images`). Por eso puede vivir en un proyecto que ya se usa para otra cosa, como el del blog de Iron Tower, sin tocar sus tablas ni sus imágenes.

1. Elegir el proyecto de Supabase donde va a vivir el blog (uno existente o uno nuevo).
2. *SQL Editor → New query*: pegar todo `supabase/schema.sql` y tocar **Run**. Crea las tablas, las reglas de seguridad y el bucket de imágenes. Se puede correr más de una vez.
3. *Project Settings → API Keys*: copiar la clave *publishable* (o *anon*) y la *secret* (o *service_role*). La URL del proyecto está en el botón **Connect**.
4. Cargar las variables de entorno de arriba en Vercel (y en `.env.local` para trabajar en local) y volver a publicar el sitio.

### Seguridad

- La web pública lee con la clave *publishable*: por las reglas de la base solo ve artículos publicados.
- La clave *secret* da acceso a todo el proyecto de Supabase (también a lo que no es de Lupa): solo vive en las variables de entorno del servidor, nunca en el navegador.
- Todo lo que escribe pasa por la API del panel, que verifica la sesión en cada pedido, valida los datos y limpia el HTML (saca scripts, estilos y eventos).
- Las imágenes se validan por su contenido real (JPG, PNG, WebP, GIF o AVIF, hasta 4 MB).
- `/admin` y `/api` están bloqueados en `robots.txt` y el panel lleva `noindex`.

## Páginas por servicio

`/servicios/sitios-web`, `/servicios/seo-geo`, `/servicios/marketing-contenido` y `/servicios/sistemas-automatizaciones-ia`. El contenido está en `src/data/paginas-servicios.ts` (título para Google, introducción, para quién es, planes, extras y preguntas). Los planes y precios se toman de `src/data/planes.ts`, así siempre coinciden con la home. Cada página tiene JSON-LD `Service`, `BreadcrumbList` y `FAQPage`, y está en el sitemap y en `/llms.txt`.

## Bandeja de consultas

El formulario de contacto guarda cada consulta en Supabase (`lupa_consultas`) y además abre WhatsApp como antes. En `/admin/consultas` se ven todas, se responden por WhatsApp con un clic, se marcan como respondidas o archivadas y se les agrega una nota interna. Si está `SMTP_PASS`, cada consulta nueva también llega por mail. Freno de spam: campo trampa invisible, tiempo mínimo de llenado y hasta 5 envíos cada 10 minutos por conexión (sin guardar la IP).

## Usuarios

En `/admin/usuarios` se crean los usuarios del equipo (nombre, email, cargo, LinkedIn y contraseña). Cada artículo puede firmarse con un autor: el blog muestra la firma y Google recibe el autor como `Person`. Las contraseñas se guardan cifradas (scrypt) y cada persona puede cambiar la suya. Un usuario desactivado pierde el acceso al instante.

## Analítica (GA4)

| Evento | Parámetros |
| --- | --- |
| `click_whatsapp` | `origen`: `header` · `hero` · `plan` · `casos` · `footer` · `flotante` · `formulario` · `404` · `blog` · `servicio` (y `plan` o `servicio` según de dónde viene) |
| `submit_form` | `necesidad` |
| `view_plan_tab` | `tab` |
| `read_progress` | `slug`, `percent` (25, 50, 75 y 100 % de un artículo leído) |
| `share` | `method` (`whatsapp`, `linkedin`, `copiar`), `slug` |

## SEO / GEO

- Un solo `<h1>`, `lang="es-AR"`, canonical, Open Graph y Twitter con imagen 1200×630.
- JSON-LD: `ProfessionalService` + `OfferCatalog`, un `Service` por pilar y `FAQPage`.
- `robots.txt` permite Googlebot, Bingbot, GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot y Google-Extended (bloquea `/admin`).
- Todo el contenido está en el HTML estático, incluidos los planes de todos los tabs y las respuestas del FAQ, para que lo lean los buscadores con IA que no ejecutan JavaScript.

## Decisiones respecto del handoff

- **Next.js 16 en lugar de 14:** la rama 14 ya no tiene soporte y `npm audit` le marca vulnerabilidades críticas que solo se corrigen en 16.x. El código usa el mismo App Router.
- **Acordeón del FAQ propio** en vez del de shadcn: el de Radix no renderiza las respuestas cerradas, y para GEO tienen que estar en el HTML.
- **`/llms.txt` como ruta generada** (sale estática en el build) en vez de un archivo en `public/`: así nunca queda con precios viejos.
- Los **links pendientes** (LinkedIn/Instagram de Lupa y LinkedIn de Priscila) no se muestran mientras estén en `null`, para no publicar links rotos.
- Los inputs del formulario usan 16 px en mobile (15 px desde 640 px) para que iOS no haga zoom al tocar un campo.

## Pendientes

- [ ] `[APELLIDO_PRISCILA]` en `src/data/home.ts`
- [ ] `[LINKEDIN_PRISCILA]` en `src/data/home.ts` (`linkedin`)
- [ ] `[LINKEDIN_LUPA]` e `[INSTAGRAM_LUPA]` en `src/config/site.ts` (`redes`)
- [ ] `[MES AÑO]` y `[Precios finales / + IVA]` en `src/data/planes.ts` (`vigenciaPrecios`)
- [ ] `[FACTURACIÓN: completar]` en `src/data/faq.ts`
- [ ] Revisar el texto de `/privacidad` (es un borrador base)
- [ ] Fotos del equipo (hoy son avatares con iniciales)
- [ ] Logo de Iron Tower (con permiso)
- [ ] `NEXT_PUBLIC_GA_ID` en Vercel

## Fase 2

- ✅ Blog y panel `/admin` (Supabase + NextAuth v5 + TipTap).
- ✅ Páginas por servicio, bandeja de consultas y usuarios del panel.
- Carpeta reservada, sin páginas ni links visibles: `/casos/[slug]`.
