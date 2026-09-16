export interface Product {
  id: string;
  title: string;
  sku: string;
  slug: string;
  categoryId: string | null;
  occasionTag: string | null;
  mrp: string;
  price: string;
  discountPct: number;
  description: string | null;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string | null; phone: string };
}

export interface Paginated<T> {
  items: T[];
  pagination: { total: number; page: number; pageSize: number };
}
