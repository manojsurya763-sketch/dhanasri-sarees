import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <div className="relative h-28 w-28">
        <Image src="/images/empty-wishlist.png" alt="" fill sizes="112px" className="object-contain" />
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
