import { CustomerTable } from "@/components/customers/CustomerTable";
import { PageHeader } from "@/components/ui/PageHeader";

export default function CustomersPage() {
  return (
    <div>
      <PageHeader title="Customers" />
      <CustomerTable />
    </div>
  );
}
