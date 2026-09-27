import { Suspense } from "react";
import { OrderTable } from "@/components/orders/OrderTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";

export default function OrdersPage() {
  return (
    <div>
      <PageHeader title="Orders" />
      <Suspense fallback={<LoadingState />}>
        <OrderTable />
      </Suspense>
    </div>
  );
}
