import Link from "next/link";
import { HeartCrack } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-maroon-500/10 text-maroon-500">
        <HeartCrack className="h-9 w-9" />
      </div>
      <h2 className="mt-6 font-[family-name:var(--font-serif-display)] text-2xl italic text-maroon-500">
        So&hellip; We&apos;re Saving Nothing Today?
      </h2>
      <p className="mt-2 max-w-xs text-sm text-maroon-900/60">
        Go on, save something you love.
      </p>
      <Link href="/category/all" className="mt-6">
        <Button showArrow>Explore more</Button>
      </Link>
    </div>
  );
}
