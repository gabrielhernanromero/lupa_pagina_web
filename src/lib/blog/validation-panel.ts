import 'server-only';

import { z } from 'zod';

import { PASSWORD_MIN } from '@/lib/passwords';

/** Validación de usuarios del panel y de las consultas del formulario. */

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

/** Nuestros mensajes están en español y terminan con punto; los genéricos de zod (en inglés) se reemplazan. */
function firstIssue(error: z.ZodError, fallback: string): string {
  const msg = error.issues[0]?.message;
  return msg && msg.endsWith('.') ? msg : fallback;
}

const textoOpcional = (max: number, nombre: string) =>
  z
    .string()
    .trim()
    .max(max, `${nombre} es demasiado largo.`)
    .nullish()
    .transform((v) => v || null);

const linkedin = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === '' || /^https:\/\/([a-z]{2,3}\.)?linkedin\.com\/[^\s"'<>]+$/i.test(v), 'El link de LinkedIn tiene que empezar con https://www.linkedin.com/')
  .nullish()
  .transform((v) => v || null);

const password = z
  .string()
  .min(PASSWORD_MIN, `La contraseña tiene que tener al menos ${PASSWORD_MIN} caracteres.`)
  .max(200, 'La contraseña es demasiado larga.');

const nuevoUsuario = z.object({
  nombre: z.string().trim().min(1, 'Poné el nombre.').max(80, 'El nombre es demasiado largo.'),
  email: z.email('El email no es válido.').transform((v) => v.trim().toLowerCase()),
  cargo: textoOpcional(80, 'El cargo'),
  linkedin,
  password,
});

const cambiosUsuario = z.object({
  nombre: z.string().trim().min(1, 'Poné el nombre.').max(80, 'El nombre es demasiado largo.').optional(),
  cargo: textoOpcional(80, 'El cargo').optional(),
  linkedin: linkedin.optional(),
  activo: z.boolean().optional(),
  password: password.optional(),
});

const cambioPassword = z.object({ actual: z.string().min(1, 'Poné tu contraseña actual.'), nueva: password });

export type NuevoUsuario = z.infer<typeof nuevoUsuario>;
export type CambiosUsuario = z.infer<typeof cambiosUsuario>;

export function parseNuevoUsuario(body: unknown): Result<NuevoUsuario> {
  const r = nuevoUsuario.safeParse(body);
  return r.success ? { ok: true, data: r.data } : { ok: false, error: firstIssue(r.error, 'Revisá los datos del usuario.') };
}

export function parseCambiosUsuario(body: unknown): Result<CambiosUsuario> {
  const r = cambiosUsuario.safeParse(body);
  return r.success ? { ok: true, data: r.data } : { ok: false, error: firstIssue(r.error, 'Revisá los datos del usuario.') };
}

export function parseCambioPassword(body: unknown): Result<z.infer<typeof cambioPassword>> {
  const r = cambioPassword.safeParse(body);
  return r.success ? { ok: true, data: r.data } : { ok: false, error: firstIssue(r.error, 'Revisá las contraseñas.') };
}

// ---- Consultas del formulario ----

const consulta = z.object({
  nombre: z.string().trim().min(1).max(120),
  empresa: textoOpcional(120, 'La empresa'),
  rubro: textoOpcional(120, 'El rubro'),
  whatsapp: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v.replace(/\D/g, '').length >= 8, 'El WhatsApp no es válido.'),
  necesidad: z.string().trim().min(1).max(80),
  mensaje: textoOpcional(2000, 'El mensaje'),
  pagina: z
    .string()
    .trim()
    .max(300)
    .nullish()
    .transform((v) => (v && v.startsWith('/') ? v : null)),
  /** Campo trampa: las personas no lo ven; si viene completo, es un robot. */
  website: z.string().max(200).optional(),
  /** Milisegundos desde que se abrió el formulario. */
  t: z.number().nonnegative().optional(),
});

export type ConsultaInput = z.infer<typeof consulta>;

export function parseConsulta(body: unknown): Result<ConsultaInput> {
  const r = consulta.safeParse(body);
  return r.success ? { ok: true, data: r.data } : { ok: false, error: firstIssue(r.error, 'Revisá los datos del formulario.') };
}

export const ESTADOS_CONSULTA = ['nueva', 'respondida', 'archivada'] as const;
export type EstadoConsulta = (typeof ESTADOS_CONSULTA)[number];

const cambiosConsulta = z.object({
  estado: z.enum(ESTADOS_CONSULTA).optional(),
  notas: textoOpcional(4000, 'La nota').optional(),
});

export function parseCambiosConsulta(body: unknown): Result<z.infer<typeof cambiosConsulta>> {
  const r = cambiosConsulta.safeParse(body);
  return r.success ? { ok: true, data: r.data } : { ok: false, error: firstIssue(r.error, 'Datos inválidos.') };
}
