import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2.5 whitespace-nowrap font-semibold transition-[transform,border-color,color,background-color,opacity] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        /** CTA principal: gradiente de marca, texto oscuro. */
        primary: 'bg-brand text-ink hover:text-ink hover:brightness-110',
        /** Secundario: borde sutil. */
        outline: 'border border-line-strong bg-transparent text-title hover:border-teal/60 hover:text-title',
      },
      size: {
        sm: 'rounded-full px-[18px] py-2.5 text-sm',
        md: 'rounded-xl p-[13px] text-[15px]',
        lg: 'rounded-xl px-[26px] py-[15px] text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'lg' },
  },
);

interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
