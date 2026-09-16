import { type ButtonHTMLAttributes, forwardRef } from "react";
import { ArrowRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-maroon-500 text-cream-50 hover:bg-maroon-600",
        secondary: "border border-maroon-500 text-maroon-500 hover:bg-maroon-50",
        ghost: "text-maroon-500 hover:bg-maroon-50",
        gold: "bg-gold-500 text-maroon-900 hover:bg-gold-600",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  showArrow?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, showArrow, children, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
      {showArrow && <ArrowRight className="h-4 w-4" />}
    </button>
  )
);
Button.displayName = "Button";
