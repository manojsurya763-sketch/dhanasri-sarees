import { ReviewTable } from "@/components/reviews/ReviewTable";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ReviewsPage() {
  return (
    <div>
      <PageHeader title="Reviews" />
      <ReviewTable />
    </div>
  );
}
