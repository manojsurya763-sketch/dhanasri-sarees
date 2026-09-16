import { Globe, RefreshCcw, Truck } from "lucide-react";

const ITEMS = [
  { icon: Truck, label: "Free Shipping Across India on Orders Above ₹5,000" },
  { icon: Globe, label: "Free International Shipping on Orders Above ₹50,000" },
  { icon: RefreshCcw, label: "Easy 7-Day Returns & Exchanges" },
];

export function TrustStrip() {
  const loop = [...ITEMS, ...ITEMS];

  return (
    <div className="overflow-hidden border-y border-maroon-500/10 bg-maroon-500 py-3">
      <div className="flex w-max animate-[marquee_22s_linear_infinite] gap-12">
        {loop.map((item, i) => (
          <div key={i} className="flex items-center gap-2 whitespace-nowrap text-xs text-cream-50 sm:text-sm">
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
