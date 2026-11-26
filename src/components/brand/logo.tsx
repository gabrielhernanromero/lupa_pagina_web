import { cn } from '@/lib/utils';

export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true" className={className}>
      <circle cx="50" cy="50" r="32" stroke="url(#lupa-grad)" strokeWidth="10" />
      <path d="M74 74 L102 102" stroke="url(#lupa-grad)" strokeWidth="12" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ size = 28, textClassName }: { size?: number; textClassName?: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className={cn('font-display text-[19px] font-extrabold tracking-[0.02em] text-title', textClassName)}>LUPA</span>
    </span>
  );
}
