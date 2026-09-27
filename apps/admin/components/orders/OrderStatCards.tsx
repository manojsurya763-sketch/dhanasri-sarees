import { Package, Truck, RotateCcw, Wallet, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { OrderStats } from "@/lib/types";

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-semibold text-slate-900">{value}</p>
      </div>
    </Card>
  );
}

export function OrderStatCards({ stats }: { stats: OrderStats }) {
  return (
    <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard icon={<Package className="h-5 w-5" />} label="Total orders" value={stats.totalOrders} />
      <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label="Delivered" value={stats.statusCounts.delivered} />
      <StatCard icon={<RotateCcw className="h-5 w-5" />} label="Returns" value={stats.returnsCount} />
      <StatCard
        icon={<Wallet className="h-5 w-5" />}
        label="Total order amount"
        value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
      />
      <StatCard icon={<Truck className="h-5 w-5" />} label="Shipped" value={stats.statusCounts.shipped} />
    </div>
  );
}
