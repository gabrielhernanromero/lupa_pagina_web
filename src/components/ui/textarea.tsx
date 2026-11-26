import * as React from 'react';

import { cn } from '@/lib/utils';
import { fieldClasses } from './input';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return <textarea className={cn(fieldClasses, 'resize-y', className)} {...props} />;
}

export { Textarea };
