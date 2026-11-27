/** Estilos compartidos del panel. */
export const ui = {
  card: 'rounded-[16px] border border-line bg-surface',
  label: 'mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.1em] text-muted',
  input:
    'w-full rounded-[10px] border border-white/[0.12] bg-surface-2 px-3.5 py-2.5 text-[15px] text-title placeholder:text-muted transition-colors focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/40',
  inputSm:
    'w-full rounded-[8px] border border-white/[0.12] bg-surface-2 px-2.5 py-1.5 text-[13px] text-title placeholder:text-muted transition-colors focus:border-teal focus:outline-none',
  btnPrimary:
    'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-brand px-4 py-2.5 text-sm font-semibold text-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50',
  btnOutline:
    'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border border-line-strong px-4 py-2.5 text-sm font-semibold text-title transition-colors hover:border-teal/60 disabled:cursor-not-allowed disabled:opacity-50',
  btnGhost:
    'inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] px-2.5 py-1.5 text-[13px] font-medium text-body transition-colors hover:bg-white/[0.05] hover:text-title disabled:cursor-not-allowed disabled:opacity-50',
  btnDanger:
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-danger/30 px-4 py-2.5 text-sm font-semibold text-danger transition-colors hover:border-danger/70 hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50',
};
