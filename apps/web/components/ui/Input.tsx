import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-maroon-900">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          "w-full rounded-lg border border-maroon-500/20 bg-cream-50 px-4 py-2.5 text-sm text-maroon-900",
          "placeholder:text-maroon-900/40 focus:outline-none focus:ring-2 focus:ring-maroon-500/40",
          className
        )}
        {...props}
      />
    </div>
  )
);
Input.displayName = "Input";
