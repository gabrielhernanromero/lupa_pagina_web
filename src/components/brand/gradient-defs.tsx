/**
 * Gradientes SVG compartidos. Se renderiza una vez en el layout.
 * - lupa-grad: para el logo (objectBoundingBox).
 * - lupa-grad-icon: para íconos lucide de 24×24 (userSpaceOnUse, así funciona
 *   también en líneas rectas, cuyo bounding box tiene ancho o alto cero).
 */
export function GradientDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="lupa-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
        <linearGradient id="lupa-grad-icon" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export const ICON_GRADIENT = 'url(#lupa-grad-icon)';
