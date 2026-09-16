import "server-only";
import type { Paginated, Product, Review } from "@/lib/types";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

async function apiFetch<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate } });
  if (!res.ok) {
    throw new Error(`API request failed: ${path} (${res.status})`);
  }
  return res.json();
}

export function getNewArrivals(limit = 8) {
  return apiFetch<Paginated<Product>>(`/products?section=new-arrivals&limit=${limit}`);
}

export function getFeaturedProducts(limit = 8) {
  return apiFetch<Paginated<Product>>(`/products?section=featured&limit=${limit}`);
}

export function getProductListing(searchParams: URLSearchParams) {
  return apiFetch<Paginated<Product>>(`/products?${searchParams.toString()}`, 30);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/products/${slug}`, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API request failed: /products/${slug} (${res.status})`);
  return res.json();
}

export function getRelatedProducts(productId: string, limit = 4) {
  return apiFetch<{ items: Product[] }>(`/products/${productId}/related?limit=${limit}`);
}

export function getProductReviews(productId: string, page = 1, limit = 10) {
  return apiFetch<Paginated<Review>>(`/products/${productId}/reviews?page=${page}&limit=${limit}`, 60);
}
