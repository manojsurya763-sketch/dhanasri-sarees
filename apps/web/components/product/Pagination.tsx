import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-10 flex justify-center gap-2">
      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium",
            p === page ? "bg-maroon-500 text-cream-50" : "text-maroon-900 hover:bg-maroon-50"
          )}
        >
          {p}
        </Link>
      ))}
    </nav>
  );
}
