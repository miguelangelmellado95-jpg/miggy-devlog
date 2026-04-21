import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-zinc-800 bg-zinc-900/70 text-zinc-400",
        accent:
          "border-cyan-400/30 bg-cyan-400/10 text-cyan-400",
        live: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
        violet:
          "border-violet-400/30 bg-violet-400/10 text-violet-300",
        outline:
          "border-zinc-700 bg-transparent text-zinc-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { badgeVariants };
