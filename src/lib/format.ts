import type { Plan } from '@/data/planes';

const ars = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatARS(n: number): string {
  return ars.format(n);
}

/** "Consultar" · "A cotizar" · "Desde $ 1.500.000" · "$ 390.000" */
export function precioLabel(p: Plan): string {
  if (!p.mostrarPrecio) return 'Consultar';
  if (p.precio === null) return 'A cotizar';
  return (p.precioDesde ? 'Desde ' : '') + formatARS(p.precio);
}

/** "/mes" solo para planes mensuales con precio mayor a 0. */
export function precioSufijo(p: Plan): string {
  return p.mostrarPrecio && p.precio && p.modalidad === 'mensual' ? '/mes' : '';
}

/** Línea debajo del precio: "Pago único · Entrega: 7 días hábiles". */
export function detallePlan(p: Plan): string {
  if (p.detalle) return p.detalle;
  return [p.modalidad === 'unico' ? 'Pago único' : 'Por mes', p.entrega && `Entrega: ${p.entrega}`]
    .filter(Boolean)
    .join(' · ');
}

/** Precio de un extra con su complemento: "$ 40.000 + proveedor". */
export function precioExtra(p: Plan): string {
  const base = precioLabel(p);
  return p.detalle && p.precio !== null ? `${base} ${p.detalle}` : base;
}
