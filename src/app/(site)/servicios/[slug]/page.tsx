import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ChevronRight, MessageCircle } from 'lucide-react';

import { ICON_GRADIENT } from '@/components/brand/gradient-defs';
import { Reveal } from '@/components/motion/reveal';
import { CheckItem, Section, SectionHeading } from '@/components/section';
import { FaqAccordion } from '@/components/sections/faq-accordion';
import { PlanCard } from '@/components/sections/planes-tabs';
import { Proceso } from '@/components/sections/proceso';
import { iconosServicio } from '@/components/sections/servicios';
import { buttonVariants } from '@/components/ui/button';
import { WhatsAppLink } from '@/components/whatsapp-link';
import { siteConfig } from '@/config/site';
import { casos } from '@/data/casos';
import { getPaginaServicio, paginasServicios } from '@/data/paginas-servicios';
import { extras, planes, vigenciaPrecios, type Plan } from '@/data/planes';
import { servicios } from '@/data/servicios';
import { precioExtra } from '@/lib/format';
import { serializeJsonLd } from '@/lib/jsonld';
import { toPlanView } from '@/lib/plan-view';
import { cn } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

/** Solo existen las páginas definidas en data/paginas-servicios.ts. */
export const dynamicParams = false;

export function generateStaticParams() {
  return paginasServicios.map((p) => ({ slug: p.id }));
}

function cargar(slug: string) {
  const servicio = servicios.find((s) => s.id === slug);
  const pagina = getPaginaServicio(slug);
  return servicio && pagina ? { servicio, pagina } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const datos = cargar((await params).slug);
  if (!datos) return {};
  const { pagina } = datos;
  const url = `${siteConfig.url}/servicios/${pagina.id}`;
  return {
    title: pagina.metaTitulo,
    description: pagina.metaDescripcion,
    alternates: { canonical: `/servicios/${pagina.id}` },
    openGraph: {
      type: 'website',
      url,
      title: `${pagina.metaTitulo} | ${siteConfig.name}`,
      description: pagina.metaDescripcion,
      siteName: siteConfig.name,
      locale: 'es_AR',
    },
    twitter: { title: `${pagina.metaTitulo} | ${siteConfig.name}`, description: pagina.metaDescripcion },
  };
}

function porIds(ids: string[], lista: Plan[]): Plan[] {
  return ids.map((id) => lista.find((p) => p.id === id)).filter((p): p is Plan => Boolean(p));
}

export default async function ServicioPage({ params }: Props) {
  const datos = cargar((await params).slug);
  if (!datos) notFound();
  const { servicio, pagina } = datos;

  const planesServicio = porIds(pagina.planes, planes);
  const extrasServicio = porIds(pagina.extras, extras);
  const destacado = planesServicio.find((p) => p.destacado)?.id;
  const otros = servicios.filter((s) => s.id !== servicio.id);
  const caso = pagina.mostrarCaso ? casos[0] : undefined;
  const Icon = iconosServicio[servicio.icono];
  const url = `${siteConfig.url}/servicios/${servicio.id}`;
  const orgId = `${siteConfig.url}/#organizacion`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#servicio`,
        name: servicio.titulo,
        description: pagina.metaDescripcion,
        url,
        serviceType: servicio.titulo,
        provider: { '@id': orgId },
        areaServed: [
          { '@type': 'Country', name: 'Argentina' },
          { '@type': 'AdministrativeArea', name: 'Buenos Aires' },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `Planes de ${servicio.titulo}`,
          itemListElement: [...planesServicio, ...extrasServicio].map((p) => ({
            '@type': 'Offer',
            name: p.nombre,
            ...(p.paraQuien && { description: p.paraQuien }),
            ...(p.mostrarPrecio && p.precio !== null && { price: p.precio, priceCurrency: 'ARS' }),
            url: `${url}#planes`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: siteConfig.url },
          { '@type': 'ListItem', position: 2, name: 'Servicios', item: `${siteConfig.url}/#servicios` },
          { '@type': 'ListItem', position: 3, name: servicio.titulo, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: pagina.preguntas.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />

      {/* Encabezado */}
      <section className="relative px-6 pb-[clamp(56px,8vw,88px)] pt-[clamp(40px,6vw,64px)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[440px] w-[min(760px,100%)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.11),transparent_65%)]"
        />
        <div className="relative mx-auto flex max-w-site flex-col gap-6">
          <nav aria-label="Ruta de navegación">
            <ol className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0 text-[13px] text-muted">
              <li>
                <Link href="/" className="text-muted hover:text-title">
                  Inicio
                </Link>
              </li>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <li>
                <Link href="/#servicios" className="text-muted hover:text-title">
                  Servicios
                </Link>
              </li>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <li aria-current="page" className="text-body">
                {servicio.titulo}
              </li>
            </ol>
          </nav>

          <div className="flex max-w-[780px] flex-col gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal/10">
              <Icon size={28} color={ICON_GRADIENT} strokeWidth={1.8} aria-hidden="true" />
            </div>
            <h1 className="m-0 text-balance font-display text-[clamp(34px,5vw,56px)] font-bold leading-[1.08] tracking-[-0.02em] text-title">
              {pagina.h1}
            </h1>
            {pagina.intro.map((p) => (
              <p key={p} className="m-0 text-[clamp(17px,2vw,19px)] leading-[1.6]">
                {p}
              </p>
            ))}
            <div className="mt-2 flex flex-wrap gap-3">
              <WhatsAppLink
                mensaje={pagina.mensaje}
                origen="servicio"
                params={{ servicio: servicio.id }}
                className={buttonVariants({ variant: 'primary', size: 'lg' })}
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Pedí tu diagnóstico sin cargo
              </WhatsAppLink>
              <a href="#planes" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                Ver planes y precios
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <Section alt containerClassName="gap-10" aria-labelledby="incluye-titulo">
        <SectionHeading id="incluye-titulo" eyebrow="Qué incluye" title={servicio.bajada} />
        <Reveal>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-x-10 gap-y-4 p-0 text-[16px] leading-[1.55] text-list">
            {servicio.items.map((it) => (
              <CheckItem key={it}>{it}</CheckItem>
            ))}
          </ul>
        </Reveal>
        {servicio.nota && <p className="m-0 max-w-[760px] text-sm leading-[1.6] text-muted">{servicio.nota}</p>}
      </Section>

      {/* Para quién es */}
      <Section containerClassName="gap-10" aria-labelledby="para-quien-titulo">
        <SectionHeading id="para-quien-titulo" eyebrow="Para quién es" title="Te sirve si…" />
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4 p-0">
          {pagina.paraQuien.map((texto, i) => (
            <Reveal as="li" key={texto} index={i} className="rounded-[18px] border border-line bg-surface p-6 text-[16px] leading-[1.55] text-list">
              {texto}
            </Reveal>
          ))}
        </ul>
      </Section>

      <Proceso />

      {/* Planes */}
      <Section id="planes" alt containerClassName="gap-9" aria-labelledby="planes-servicio-titulo">
        <SectionHeading
          id="planes-servicio-titulo"
          eyebrow="Planes"
          title="Elegí cómo arrancar"
          text="Precios claros y por escrito. Si no sabés cuál te conviene, escribinos y te recomendamos uno."
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,270px),1fr))] items-stretch gap-[18px]">
          {planesServicio.map((p) => (
            // Un solo "Más elegido" por página: el primero de la lista que lo tenga.
            <PlanCard key={p.id} plan={{ ...toPlanView(p), destacado: p.id === destacado }} />
          ))}
        </div>
        {extrasServicio.length > 0 && (
          <div className="flex flex-col gap-3 rounded-[20px] border border-line bg-surface p-7">
            <h3 className="m-0 font-display text-[19px] font-semibold text-title">También podés sumar</h3>
            <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-x-10">
              {extrasServicio.map((x) => (
                <div key={x.id} className="flex justify-between gap-4 border-b border-line-soft py-[11px] text-sm">
                  <dt className="text-list">{x.nombre}</dt>
                  <dd className="m-0 shrink-0 text-right font-semibold text-title">{precioExtra(x)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        <p className="m-0 text-[13px] text-muted">
          {vigenciaPrecios}{' '}
          <Link href="/#planes" className="whitespace-nowrap">
            Ver todos los planes
          </Link>
        </p>
      </Section>

      {/* Caso */}
      {caso && (
        <Section containerClassName="gap-8" aria-labelledby="caso-titulo">
          <SectionHeading id="caso-titulo" eyebrow="Un caso real" title={caso.cliente} text={caso.rubro} />
          <Reveal className="grid gap-6 rounded-[20px] border border-line bg-surface p-[clamp(24px,3vw,36px)] md:grid-cols-3">
            {(
              [
                ['El desafío', caso.desafio],
                ['Qué hicimos', caso.queHicimos],
                ['El resultado', caso.resultado],
              ] as const
            ).map(([titulo, texto]) => (
              <div key={titulo} className="flex flex-col gap-2">
                <h3 className="m-0 text-[13px] font-semibold uppercase tracking-[0.12em] text-teal">{titulo}</h3>
                <p className="m-0 text-[15px] leading-[1.6] text-list">{texto}</p>
              </div>
            ))}
          </Reveal>
        </Section>
      )}

      {/* Preguntas */}
      <Section alt containerClassName="max-w-[820px] gap-9" aria-labelledby="preguntas-servicio-titulo">
        <SectionHeading id="preguntas-servicio-titulo" eyebrow="Preguntas frecuentes" title="Lo que más nos preguntan." />
        <FaqAccordion items={pagina.preguntas} />
      </Section>

      {/* Otros servicios */}
      <Section containerClassName="gap-8" aria-labelledby="otros-titulo">
        <h2 id="otros-titulo" className="m-0 font-display text-[clamp(24px,3vw,32px)] font-bold text-title">
          Otros servicios
        </h2>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4 p-0">
          {otros.map((s) => {
            const OtroIcon = iconosServicio[s.icono];
            return (
              <li key={s.id}>
                <Link
                  href={`/servicios/${s.id}`}
                  className="group flex h-full flex-col gap-3 rounded-[18px] border border-line bg-surface p-6 transition-colors hover:border-teal/40"
                >
                  <OtroIcon size={22} color={ICON_GRADIENT} strokeWidth={1.8} aria-hidden="true" />
                  <span className="font-display text-[18px] font-semibold text-title">{s.titulo}</span>
                  <span className="text-[14.5px] leading-[1.55] text-body">{s.bajada}</span>
                  <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-teal">
                    Ver servicio <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Llamado final */}
      <section className="px-6 pb-[clamp(72px,9vw,112px)]">
        <div className="relative mx-auto max-w-[880px] overflow-hidden rounded-[22px] border border-teal/25 bg-surface px-7 py-10 text-center md:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-[min(560px,100%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.18),transparent_70%)]"
          />
          <h2 className="relative m-0 text-balance font-display text-[clamp(24px,3vw,32px)] font-bold leading-[1.2] text-title">
            {siteConfig.lema}
          </h2>
          <p className="relative mx-auto mt-3 max-w-[480px] text-[16px] leading-[1.6]">
            Contanos qué hacés y te decimos por dónde empezar. El diagnóstico inicial es sin cargo.
          </p>
          <WhatsAppLink
            mensaje={pagina.mensaje}
            origen="servicio"
            params={{ servicio: servicio.id }}
            className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'relative mt-7')}
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Escribinos por WhatsApp
          </WhatsAppLink>
        </div>
      </section>
    </>
  );
}
