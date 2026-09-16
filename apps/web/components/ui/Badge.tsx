import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full font-semibold px-2.5 py-1 text-xs", {
  variants: {
    variant: {
      discount: "bg-purple-600 text-white",
      maroon: "bg-maroon-500 text-cream-50",
      gold: "bg-gold-500 text-maroon-900",
      outline: "border border-maroon-500 text-maroon-500",
    },
  },
  defaultVariants: { variant: "discount" },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
