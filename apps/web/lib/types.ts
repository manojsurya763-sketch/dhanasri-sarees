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
  fabric: string | null;
  colour: string | null;
  origin: string | null;
  zari: string | null;
  loom: string | null;
  work: string | null;
  length: string | null;
  blouseTypes: string[];
  internationalShipping: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  occasionTag: string | null;
  description: string | null;
}

export interface Review {
  id: string;
  productId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string | null; phone: string };
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Paginated<T> {
  items: T[];
  pagination: { total: number; page: number; pageSize: number };
}

export interface FacetOption {
  value: string;
  count: number;
}

export interface ProductFacets {
  fabric: FacetOption[];
  colour: FacetOption[];
  origin: FacetOption[];
  zari: FacetOption[];
  loom: FacetOption[];
  occasion: FacetOption[];
  blouseType: FacetOption[];
  discount: { label: string; count: number }[];
  internationalShippingCount: number;
  priceRange: { min: number; max: number };
}
