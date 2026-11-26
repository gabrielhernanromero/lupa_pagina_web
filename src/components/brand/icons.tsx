import type { LucideProps } from 'lucide-react';

export { Calendar, ChartLine, Code, Cpu, Key, MessageSquare, Monitor, Users, ZoomIn } from 'lucide-react';

/** lucide 1.x no incluye logos de marcas: este es el glifo de Instagram del diseño. */
export function Instagram({ color = 'currentColor', size = 24, strokeWidth = 2, ...props }: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" />
    </svg>
  );
}

export type IconComponent = React.ComponentType<LucideProps>;
