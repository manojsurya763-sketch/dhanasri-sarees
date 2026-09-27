import { ProductForm } from "@/components/products/ProductForm";
import { PageHeader } from "@/components/ui/PageHeader";

export default function NewProductPage() {
  return (
    <div>
      <PageHeader title="New product" backHref="/products" />
      <ProductForm />
    </div>
  );
}
