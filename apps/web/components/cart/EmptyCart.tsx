import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-maroon-500/10 text-maroon-500">
        <ShoppingBag className="h-9 w-9" />
      </div>
      <h2 className="mt-6 font-[family-name:var(--font-serif-display)] text-2xl italic text-maroon-500">
        Nothing Here, Yet!
      </h2>
      <p className="mt-2 max-w-xs text-sm text-maroon-900/60">
        Maybe it&apos;s time to add a little something beautiful.
      </p>
      <Link href="/category/all" className="mt-6">
        <Button showArrow>Discover Sarees</Button>
      </Link>
    </div>
  );
}
