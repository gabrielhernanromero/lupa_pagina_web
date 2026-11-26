'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List className={cn('flex gap-2', className)} {...props} />;
}

/** Pastilla: activa con gradiente de marca, inactiva con borde. */
function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'flex-none cursor-pointer whitespace-nowrap rounded-full border border-line-strong bg-transparent px-[22px] py-[11px] text-[15px] font-semibold text-list transition-all duration-200',
        'hover:border-teal/60 hover:text-title',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-ink-alt',
        'data-[state=active]:border-transparent data-[state=active]:bg-brand data-[state=active]:text-ink',
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn('focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60 rounded-[20px]', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
