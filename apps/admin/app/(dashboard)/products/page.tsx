import { ProductTable } from "@/components/products/ProductTable";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ProductsPage() {
  return (
    <div>
      <PageHeader title="Products" />
      <ProductTable />
    </div>
  );
}
