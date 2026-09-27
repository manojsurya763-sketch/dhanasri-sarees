"use client";

import { use, useEffect, useState } from "react";
import { getDiscount } from "@/lib/api";
import { DiscountForm } from "@/components/discounts/DiscountForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import type { Coupon } from "@/lib/types";

export default function EditDiscountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDiscount(id)
      .then(setCoupon)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load discount"));
  }, [id]);

  if (error) return <ErrorState message={error} />;
  if (!coupon) return <LoadingState />;

  return (
    <div>
      <PageHeader title={`Edit ${coupon.code}`} backHref="/discounts" />
      <DiscountForm coupon={coupon} />
    </div>
  );
}
