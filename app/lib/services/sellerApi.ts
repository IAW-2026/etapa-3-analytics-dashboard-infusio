export interface SellerStats {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  avgRating: number;
  topCategory: string;
}

export interface SellerProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  revenue: number;
}

export interface CategoryPoint {
  category: string;
  count: number;
  revenue: number;
  color: string;
}

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Seller API error ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

export async function getSellerStats(): Promise<SellerStats> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { sellerMock } = await import("@/app/lib/mock/sellerMock");
    return sellerMock.stats;
  }
  return apiFetch<SellerStats>(`${process.env.SELLER_API_URL}/analytics/stats`);
}

export async function getTopProducts(): Promise<SellerProduct[]> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { sellerMock } = await import("@/app/lib/mock/sellerMock");
    return sellerMock.topProducts;
  }
  return apiFetch<SellerProduct[]>(`${process.env.SELLER_API_URL}/analytics/top-products`);
}

export async function getProductList(): Promise<SellerProduct[]> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { sellerMock } = await import("@/app/lib/mock/sellerMock");
    return sellerMock.productList;
  }
  return apiFetch<SellerProduct[]>(`${process.env.SELLER_API_URL}/analytics/products`);
}

export async function getCategoryData(): Promise<CategoryPoint[]> {
  if (process.env.ENABLE_MOCKS === "true") {
    const { sellerMock } = await import("@/app/lib/mock/sellerMock");
    return sellerMock.categoryData;
  }
  return apiFetch<CategoryPoint[]>(`${process.env.SELLER_API_URL}/analytics/categories`);
}
