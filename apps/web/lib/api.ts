import "server-only";
import type { Category, Paginated, Product, ProductFacets, Review } from "@/lib/types";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
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
  return apiFetch<Paginated<Product>>(`/products?${searchParams.toString()}`);
}

export function getProductFacets(searchParams: URLSearchParams) {
  return apiFetch<ProductFacets>(`/products/facets?${searchParams.toString()}`);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const res = await fetch(`${API_URL}/categories/${slug}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API request failed: /categories/${slug} (${res.status})`);
  return res.json();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/products/${slug}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API request failed: /products/${slug} (${res.status})`);
  return res.json();
}

export function getRelatedProducts(productId: string, limit = 4) {
  return apiFetch<{ items: Product[] }>(`/products/${productId}/related?limit=${limit}`);
}

export function getProductReviews(productId: string, page = 1, limit = 10) {
  return apiFetch<Paginated<Review>>(`/products/${productId}/reviews?page=${page}&limit=${limit}`);
}
