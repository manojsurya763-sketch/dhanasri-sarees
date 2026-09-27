import { ShieldCheck, Truck, Undo2 } from "lucide-react";

const ITEMS = [
  { icon: Truck, title: "Free Shipping", subtitle: "On orders over ₹5,000" },
  { icon: Undo2, title: "Easy Returns", subtitle: "7-day return policy" },
  { icon: ShieldCheck, title: "Secure Payment", subtitle: "100% safe checkout" },
];

export function TrustIcons() {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-xl border border-maroon-500/10 bg-cream-50 p-3 text-center">
      {ITEMS.map(({ icon: Icon, title, subtitle }) => (
        <div key={title} className="flex flex-col items-center gap-1 px-1">
          <Icon className="h-4 w-4 text-maroon-500" />
          <p className="text-[11px] font-medium text-maroon-900">{title}</p>
          <p className="text-[10px] text-maroon-900/50">{subtitle}</p>
        </div>
      ))}
    </div>
  );
}
