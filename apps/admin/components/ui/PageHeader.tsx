import Link from "next/link";

interface PageHeaderProps {
  title: string;
  backHref?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, backHref, action }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {backHref && (
        <Link href={backHref} className="mb-1 inline-block text-xs font-medium text-slate-500 hover:text-slate-900">
          ← Back
        </Link>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        {action}
      </div>
    </div>
  );
}
