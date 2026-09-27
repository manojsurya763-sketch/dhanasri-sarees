import { DiscountForm } from "@/components/discounts/DiscountForm";
import { PageHeader } from "@/components/ui/PageHeader";

export default function NewDiscountPage() {
  return (
    <div>
      <PageHeader title="New discount" backHref="/discounts" />
      <DiscountForm />
    </div>
  );
}
