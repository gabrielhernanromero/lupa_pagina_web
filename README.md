# Lupa Servicios Digitales: sitio web

Home de una sola página (con anclas) para **Lupa Servicios Digitales**. Objetivo único: que el visitante escriba por WhatsApp o complete el formulario.

**Producción:** https://lupaserviciosdigitales.com

## Stack

- **Next.js 16** (App Router, 100 % estático) + **React 19** + **TypeScript**
- **Tailwind CSS 3** + componentes estilo **shadcn/ui** (Radix): Sheet, Tabs, Button, Input y Textarea
- **Framer Motion** (aparición al scrollear, carga diferida con `LazyMotion`)
- **lucide-react** (íconos)
- **@next/third-parties** (Google Analytics 4)
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
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número para los links de WhatsApp (`5491154661480`). Si no está, se usa ese mismo por defecto. |
| `NEXT_PUBLIC_GA_ID` | ID de GA4 (`G-XXXXXXXXXX`). Si está vacío, GA no se carga. |

En Vercel: *Project → Settings → Environment Variables*.

## Dónde se edita cada cosa

**Ningún texto, precio ni dato de contacto está escrito dentro de los componentes.** Todo vive en:

| Archivo | Contenido |
| --- | --- |
| `src/config/site.ts` | Nombre, dominio, WhatsApp, email, redes, mensajes de WhatsApp y menú |
| `src/data/planes.ts` | Planes por categoría, notas de cada tab, extras y línea de vigencia de precios |
| `src/data/servicios.ts` | Los 4 pilares de servicio |
| `src/data/faq.ts` | Preguntas frecuentes (alimenta el acordeón **y** el JSON-LD `FAQPage`) |
| `src/data/casos.ts` | Casos de clientes y la frase de la franja de confianza |
| `src/data/home.ts` | Problemas, pasos del proceso, beneficios, equipo y opciones del formulario |

Al cambiar precios o planes se actualizan solos la página, el JSON-LD (`OfferCatalog`) y `/llms.txt`.

Formato de precios: `Intl.NumberFormat('es-AR', ARS)`. `mostrarPrecio: false` muestra "Consultar", `precio: null` muestra "A cotizar" y los planes mensuales llevan "/mes".

## Estructura

```
src/
  app/
    page.tsx              Home (secciones + JSON-LD)
    layout.tsx            Fuentes, metadata, header, footer, GA4
    privacidad/page.tsx   Política de privacidad
    not-found.tsx         404 propia
    sitemap.ts · robots.ts
    opengraph-image.tsx · twitter-image.tsx · apple-icon.tsx · icon.svg
    llms.txt/route.ts     /llms.txt generado desde los datos
    blog/ servicios/ casos/ admin/   Fase 2 (carpetas vacías, sin rutas ni links)
  components/
    layout/      Header, menú mobile, footer, botón flotante
    sections/    Una sección por archivo
    ui/          Componentes base (shadcn/ui)
    motion/      Reveal (aparición al scrollear)
    brand/       Logo, gradientes e íconos
  config/site.ts
  data/
  lib/           whatsapp.ts, format.ts, analytics.ts, jsonld.ts, og.tsx
scripts/generate-firma.mjs
public/firma/logo-firma.png   Logo para la firma de mail (600×180, usar a 300×90)
```

## Analítica (GA4)

| Evento | Parámetros |
| --- | --- |
| `click_whatsapp` | `origen`: `header` · `hero` · `plan` · `casos` · `footer` · `flotante` · `formulario` · `404` (y `plan` cuando viene de una card) |
| `submit_form` | `necesidad` |
| `view_plan_tab` | `tab` |

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

Carpetas reservadas, sin páginas ni links visibles: `/blog`, `/blog/[slug]`, `/servicios/[slug]`, `/casos/[slug]` y `/admin` (Supabase + NextAuth v5 + TipTap).
