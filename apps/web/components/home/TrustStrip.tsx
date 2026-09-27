import { OrnamentIcon } from "@/components/ui/OrnamentIcon";

const ITEMS = [
  "Free Shipping Across India on Orders Above ₹5,000",
  "Free International Shipping on Orders Above ₹50,000",
  "Easy 7-Day Returns & Exchanges",
];

export function TrustStrip() {
  const loop = [...ITEMS, ...ITEMS];

  return (
    <div className="overflow-hidden border-y border-maroon-500/10 bg-maroon-500 py-5">
      <div className="flex w-max animate-[marquee_22s_linear_infinite] items-center gap-8">
        {loop.map((label, i) => (
          <div key={i} className="flex items-center gap-8">
            <span className="whitespace-nowrap text-xs italic text-cream-50 sm:text-sm">{label}</span>
            <OrnamentIcon className="h-8 w-8 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
