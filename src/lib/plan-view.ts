import { siteConfig } from '@/config/site';
import type { Plan } from '@/data/planes';
import type { PlanView } from '@/components/sections/planes-tabs';
import { detallePlan, precioLabel, precioSufijo } from './format';

/**
 * Datos de un plan listos para la tarjeta. Los precios se formatean en el servidor
 * y llegan como texto al componente cliente (así no cambian al hidratar).
 */
export function toPlanView(p: Plan): PlanView {
  return {
    id: p.id,
    nombre: p.nombre,
    paraQuien: p.paraQuien,
    precio: precioLabel(p),
    sufijo: precioSufijo(p),
    detalle: detallePlan(p),
    incluye: p.incluye,
    nota: p.nota ?? '',
    destacado: Boolean(p.destacado),
    ctaTexto: p.ctaTexto ?? 'Quiero este plan',
    mensaje: siteConfig.mensajes.plan(p.nombre),
  };
}
