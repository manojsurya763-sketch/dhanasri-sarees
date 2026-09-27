import { ReturnTable } from "@/components/returns/ReturnTable";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ReturnsPage() {
  return (
    <div>
      <PageHeader title="Returns & Refunds" />
      <ReturnTable />
    </div>
  );
}
