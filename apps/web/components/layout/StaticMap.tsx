import { Button } from "@/components/ui/Button";

export function StaticMap() {
  return (
    <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-[linear-gradient(var(--color-maroon-500)_1px,transparent_1px),linear-gradient(90deg,var(--color-maroon-500)_1px,transparent_1px)] bg-[length:32px_32px] bg-cream-200 sm:h-96">
      <div className="absolute bottom-4 left-4 max-w-xs rounded-xl bg-cream-50 p-4 shadow-lg sm:bottom-6 sm:left-6">
        <p className="font-[family-name:var(--font-serif-display)] text-lg text-maroon-500">
          Dhana Sri Sarees
        </p>
        <p className="mt-1 text-sm text-maroon-900/70">
          123 Silk Street, T. Nagar, Chennai, Tamil Nadu 600017
        </p>
        <Button size="sm" className="mt-3" showArrow>
          Get Direction
        </Button>
      </div>
    </div>
  );
}
