"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({ title, children, defaultOpen }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <div className="border-b border-maroon-500/10 py-4">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between text-left">
        <span className="text-sm font-semibold text-maroon-900">{title}</span>
        <ChevronDown className={cn("h-4 w-4 text-maroon-900/60 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="mt-3 text-sm text-maroon-900/70">{children}</div>}
    </div>
  );
}
