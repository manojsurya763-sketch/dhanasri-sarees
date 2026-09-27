import clsx from "clsx";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("rounded-md border border-slate-200 bg-white p-4", className)}>{children}</div>;
}
