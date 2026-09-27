import { ProductTable } from "@/components/products/ProductTable";
import { PageHeader } from "@/components/ui/PageHeader";

export default function InventoryPage() {
  return (
    <div>
      <PageHeader title="Inventory" />
      <p className="-mt-4 mb-4 text-sm text-slate-500">Products at or below 5 units in stock, lowest first.</p>
      <ProductTable pinnedLowStock />
    </div>
  );
}
