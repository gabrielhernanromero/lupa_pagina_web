import { siteConfig } from '@/config/site';
import { getPublishedPosts } from '@/lib/blog/queries';
import { casos } from '@/data/casos';
import { faq } from '@/data/faq';
import { extras, planes, tabsPlanes } from '@/data/planes';
import { servicios } from '@/data/servicios';
import { detallePlan, precioExtra, precioLabel, precioSufijo } from '@/lib/format';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

/** Se regenera al publicar desde el panel; esto es solo un respaldo. */
export const revalidate = 3600;

/** /llms.txt (https://llmstxt.org): resumen del sitio para modelos de lenguaje, generado desde los mismos datos de la web. */
export async function GET() {
  const posts = await getPublishedPosts(30);
  const u = siteConfig.url;
  const lines: string[] = [
    `# ${siteConfig.name}`,
    '',
    `> ${siteConfig.description} Agencia de 2 personas (desarrollo + marketing) con base en Zona Oeste, Buenos Aires, Argentina. Trabajamos con pymes de servicios del AMBA y de todo el país de forma remota.`,
    '',
    '## Contacto',
    '',
    `- WhatsApp: ${siteConfig.whatsapp.display} (${buildWhatsAppUrl()})`,
    `- Email: ${siteConfig.email}`,
    `- Web: ${u}`,
    '- Primer paso: diagnóstico inicial sin cargo. Respondemos en el día hábil.',
    '',
    '## Servicios',
    '',
    ...servicios.flatMap((s) => [`### ${s.titulo}`, '', s.bajada, '', ...s.items.map((i) => `- ${i}`), ...(s.nota ? ['', s.nota] : []), '']),
    '## Planes y precios',
    '',
    ...tabsPlanes.flatMap((t) => [
      `### ${t.label}`,
      '',
      ...planes
        .filter((p) => p.categoria === t.id)
        .map((p) => `- **${p.nombre}** — ${precioLabel(p)}${precioSufijo(p)} (${detallePlan(p)}). ${p.paraQuien} Incluye: ${p.incluye.join('; ')}.${p.nota ? ` ${p.nota}` : ''}`),
      ...(t.nota ? ['', t.nota] : []),
      '',
    ]),
    '### Extras',
    '',
    ...extras.map((x) => `- ${x.nombre}: ${precioExtra(x)}`),
    '',
    'Precios en pesos argentinos (ARS).',
    '',
    '## Casos',
    '',
    ...casos.map((c) => `- [${c.cliente}](${c.url}) (${c.rubro}): ${c.queHicimos} Resultado: ${c.resultado}`),
    '',
    '## Preguntas frecuentes',
    '',
    ...faq.map((f) => `- **${f.q}** ${f.a}`),
    '',
    '## Páginas',
    '',
    `- [Inicio](${u}/): servicios, planes, casos, equipo y contacto`,
    ...servicios.map((s) => `- [${s.titulo}](${u}/servicios/${s.id}): ${s.bajada}`),
    `- [Blog](${u}/blog): guías sobre sitios web, Google, redes e IA para pymes`,
    `- [Política de privacidad](${u}/privacidad)`,
    '',
    ...(posts.length
      ? ['## Artículos del blog', '', ...posts.map((p) => `- [${p.title}](${u}/blog/${p.slug})${p.excerpt ? `: ${p.excerpt}` : ''}`), '']
      : []),
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
