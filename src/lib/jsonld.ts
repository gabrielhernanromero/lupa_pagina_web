import { siteConfig } from '@/config/site';
import { faq } from '@/data/faq';
import { equipo } from '@/data/home';
import { extras, planes, tabsPlanes, type Plan } from '@/data/planes';
import { servicios } from '@/data/servicios';

const url = siteConfig.url;
const orgId = `${url}/#organizacion`;

const areaServed = [
  { '@type': 'Country', name: 'Argentina' },
  { '@type': 'AdministrativeArea', name: 'Buenos Aires' },
];

function offer(p: Plan) {
  const base = {
    '@type': 'Offer',
    name: p.nombre,
    ...(p.paraQuien && { description: p.paraQuien }),
    url: `${url}/#planes`,
    priceCurrency: 'ARS',
    itemOffered: { '@type': 'Service', name: p.nombre, provider: { '@id': orgId } },
  };
  if (p.precio === null) return base;
  if (p.precioDesde) {
    return { ...base, priceSpecification: { '@type': 'PriceSpecification', minPrice: p.precio, priceCurrency: 'ARS' } };
  }
  if (p.modalidad === 'mensual') {
    return {
      ...base,
      price: p.precio,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: p.precio,
        priceCurrency: 'ARS',
        unitCode: 'MON',
        unitText: 'mes',
      },
    };
  }
  return { ...base, price: p.precio };
}

export function buildJsonLd() {
  const sameAs = Object.values(siteConfig.redes).filter((v): v is string => Boolean(v));

  const catalogo = {
    '@type': 'OfferCatalog',
    name: 'Planes de Lupa Servicios Digitales',
    itemListElement: [
      ...tabsPlanes.map((t) => ({
        '@type': 'OfferCatalog',
        name: t.label,
        itemListElement: planes.filter((p) => p.categoria === t.id && p.mostrarPrecio).map(offer),
      })),
      {
        '@type': 'OfferCatalog',
        name: 'Extras',
        itemListElement: extras.filter((p) => p.mostrarPrecio).map(offer),
      },
    ],
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        url,
        name: siteConfig.name,
        inLanguage: siteConfig.locale,
        publisher: { '@id': orgId },
      },
      {
        '@type': 'ProfessionalService',
        '@id': orgId,
        name: siteConfig.name,
        url,
        email: siteConfig.email,
        telephone: siteConfig.whatsapp.e164,
        description: siteConfig.description,
        slogan: siteConfig.lema,
        image: `${url}/opengraph-image`,
        logo: `${url}/apple-icon`,
        areaServed,
        address: { '@type': 'PostalAddress', addressRegion: 'Buenos Aires', addressCountry: 'AR' },
        founder: equipo
          .filter((p) => !p.nombre.includes('['))
          .map((p) => ({
            '@type': 'Person',
            name: p.nombre,
            jobTitle: p.rol,
            ...(p.linkedin && { sameAs: [p.linkedin] }),
          })),
        ...(sameAs.length > 0 && { sameAs }),
        hasOfferCatalog: catalogo,
      },
      ...servicios.map((s) => ({
        '@type': 'Service',
        '@id': `${url}/#servicio-${s.id}`,
        name: s.titulo,
        serviceType: s.titulo,
        description: `${s.bajada} ${s.items.join('. ')}.`,
        provider: { '@id': orgId },
        areaServed,
      })),
      {
        '@type': 'FAQPage',
        '@id': `${url}/#preguntas`,
        inLanguage: siteConfig.locale,
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
}

/** Serializa JSON-LD escapando "<" para que no pueda cerrar el <script>. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
