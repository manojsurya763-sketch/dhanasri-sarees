import type { ReturnStatus } from "@/lib/types";

const STYLES: Record<ReturnStatus, string> = {
  requested: "bg-slate-100 text-slate-600",
  processing: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export function ReturnStatusBadge({ status }: { status: ReturnStatus }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STYLES[status]}`}>{status}</span>
  );
}
