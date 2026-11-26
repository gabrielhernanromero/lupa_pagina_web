import type { Metadata } from 'next';
import Link from 'next/link';

import { mailtoHref, siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description: 'Cómo Lupa Servicios Digitales trata los datos personales que nos dejás en este sitio.',
  alternates: { canonical: '/privacidad' },
};

/*
 * PENDIENTE: texto de /privacidad. Este es un borrador base; revisarlo
 * (idealmente con asesoría legal) antes de publicar.
 */
export default function PrivacidadPage() {
  return (
    <article className="px-6 py-[clamp(56px,8vw,96px)]">
      <div className="mx-auto flex max-w-[760px] flex-col gap-8 text-[15px] leading-[1.7]">
        <header className="flex flex-col gap-3.5">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-teal">Legal</p>
          <h1 className="m-0 font-display text-[clamp(32px,4.4vw,48px)] font-bold leading-[1.08] tracking-[-0.01em] text-title">
            Política de privacidad
          </h1>
          <p className="m-0 text-sm text-muted">Última actualización: noviembre de 2026</p>
        </header>

        <Bloque titulo="Quiénes somos">
          <p>
            {siteConfig.name} ({siteConfig.domain}) es un equipo de desarrollo web y marketing con base en Zona Oeste,
            Buenos Aires, Argentina. Para cualquier consulta sobre tus datos personales escribinos a{' '}
            <a href={mailtoHref}>{siteConfig.email}</a>.
          </p>
        </Bloque>

        <Bloque titulo="Qué datos recibimos">
          <p>
            Este sitio no tiene cuentas de usuario ni guarda los datos del formulario en un servidor propio. Cuando
            completás el formulario de contacto, los datos que escribiste (nombre, empresa, rubro, WhatsApp, qué
            necesitás y tu mensaje) se arman como un mensaje que se abre en WhatsApp, y recién nos llegan cuando vos lo
            enviás. Lo mismo pasa si nos escribís por mail.
          </p>
          <p>
            Además, usamos Google Analytics 4 para medir de forma agregada cómo se usa el sitio (páginas vistas, clics
            en los botones de contacto, tipo de dispositivo). Google Analytics usa cookies propias. Podés bloquearlas
            desde la configuración de tu navegador o con el{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
              complemento de inhabilitación de Google
            </a>
            .
          </p>
        </Bloque>

        <Bloque titulo="Para qué los usamos">
          <p>
            Usamos tus datos solo para responderte, preparar el diagnóstico o la propuesta que nos pediste y, si
            trabajamos juntos, para gestionar el servicio. No los vendemos ni los compartimos con terceros para
            publicidad.
          </p>
        </Bloque>

        <Bloque titulo="Servicios de terceros">
          <p>
            La conversación por WhatsApp se rige por las políticas de WhatsApp (Meta), y la medición del sitio por las
            de Google. El sitio está alojado en Vercel.
          </p>
        </Bloque>

        <Bloque titulo="Tus derechos">
          <p>
            Según la Ley 25.326 de Protección de Datos Personales, podés pedirnos en cualquier momento acceder a tus
            datos, corregirlos o que los eliminemos, escribiendo a <a href={mailtoHref}>{siteConfig.email}</a>. Te
            respondemos dentro de los plazos que fija la ley.
          </p>
          <p>
            El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma
            gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto
            conforme lo establecido en el artículo 14, inciso 3 de la Ley 25.326.
          </p>
          <p>
            La Agencia de Acceso a la Información Pública, en su carácter de órgano de control de la Ley 25.326, tiene
            la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus
            derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.
          </p>
        </Bloque>

        <Bloque titulo="Cambios">
          <p>Si cambiamos esta política, vas a ver la nueva fecha de actualización arriba.</p>
        </Bloque>

        <p>
          <Link href="/">← Volver al inicio</Link>
        </p>
      </div>
    </article>
  );
}

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 [&_p]:m-0">
      <h2 className="m-0 font-display text-xl font-semibold text-title">{titulo}</h2>
      {children}
    </section>
  );
}
