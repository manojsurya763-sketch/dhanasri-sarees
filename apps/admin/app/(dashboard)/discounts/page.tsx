import { DiscountTable } from "@/components/discounts/DiscountTable";
import { PageHeader } from "@/components/ui/PageHeader";

export default function DiscountsPage() {
  return (
    <div>
      <PageHeader title="Discounts" />
      <DiscountTable />
    </div>
  );
}
