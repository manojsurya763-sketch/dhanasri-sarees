"use client";

import { use, useEffect, useState } from "react";
import { getProduct } from "@/lib/api";
import { ProductForm } from "@/components/products/ProductForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import type { Product } from "@/lib/types";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load product"));
  }, [id]);

  if (error) return <ErrorState message={error} />;
  if (!product) return <LoadingState />;

  return (
    <div>
      <PageHeader title={`Edit ${product.title}`} backHref="/products" />
      <ProductForm product={product} />
    </div>
  );
}
