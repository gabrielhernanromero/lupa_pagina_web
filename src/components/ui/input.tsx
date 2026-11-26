import * as React from 'react';

import { cn } from '@/lib/utils';

export const fieldClasses =
  'w-full rounded-[10px] border border-white/[0.12] bg-ink px-3.5 py-[13px] text-base text-title outline-none transition-colors placeholder:text-muted focus:border-teal sm:text-[15px] aria-[invalid=true]:border-danger/70';

function Input({ className, type = 'text', ...props }: React.ComponentProps<'input'>) {
  return <input type={type} className={cn(fieldClasses, className)} {...props} />;
}

export { Input };
