import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { PageHeader } from "@/components/ui/PageHeader";

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics" />
      <AnalyticsDashboard />
    </div>
  );
}
