export interface SellerStats {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  topCategory: string;
}

export interface SellerProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  revenue: number;
}

export interface CategoryPoint {
  category: string;
  count: number;
  revenue: number;
  color: string;
}

const EARTHY_COLORS = ["#6b7056", "#9b4a30", "#7A6C5D", "#b07d62", "#4a5568", "#8B7355"];
const LOW_STOCK_THRESHOLD = 20;

interface RawProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  categories: string[];
  isActive: boolean;
}

interface ProductsResponse {
  products: RawProduct[];
  total: number;
}

async function fetchAllProducts(): Promise<ProductsResponse> {
  const res = await fetch(`${process.env.SELLER_API_URL}/products?limit=100`, {
    headers: { Authorization: `Bearer ${process.env.SELLER_APP_KEY}` },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Seller API error ${res.status}`);
  return res.json() as Promise<ProductsResponse>;
}

async function fetchBuyerTopProducts(): Promise<{ productName: string; totalRevenue: number; totalQuantity: number }[]> {
  try {
    const res = await fetch(process.env.BUYER_API_URL!, {
      headers: { Authorization: `Bearer ${process.env.BUYER_API_KEY}`, "Content-Type": "application/json" },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json() as { topProducts?: { productName: string; totalRevenue: number; totalQuantity: number }[] };
    return data.topProducts ?? [];
  } catch {
    return [];
  }
}

function useMock() {
  return process.env.ENABLE_MOCKS === "true" || !process.env.SELLER_API_URL;
}

export async function getSellerStats(): Promise<SellerStats> {
  if (useMock()) {
    const { sellerMock } = await import("@/app/lib/mock/sellerMock");
    return sellerMock.stats;
  }
  const { products, total } = await fetchAllProducts();
  const active = products.filter((p) => p.isActive);
  const inStock = active.filter((p) => p.stock > LOW_STOCK_THRESHOLD).length;
  const lowStock = active.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD).length;
  const outOfStock = active.filter((p) => p.stock === 0).length;

  const categoryCounts: Record<string, number> = {};
  for (const p of active) {
    const cat = p.categories[0] ?? "Sin categoría";
    categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
  }
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return { totalProducts: total, inStock, lowStock, outOfStock, topCategory };
}

// Uses buyer's actual sales data — these are the real top-selling products
export async function getTopProducts(): Promise<SellerProduct[]> {
  if (useMock()) {
    const { sellerMock } = await import("@/app/lib/mock/sellerMock");
    return sellerMock.topProducts;
  }
  const buyerTop = await fetchBuyerTopProducts();
  if (buyerTop.length > 0) {
    return buyerTop.slice(0, 8).map((p, i) => ({
      id: String(i),
      name: p.productName,
      category: "",
      price: p.totalQuantity > 0 ? Math.round(p.totalRevenue / p.totalQuantity) : 0,
      stock: p.totalQuantity,
      revenue: p.totalRevenue,
    }));
  }
  // Fallback: seller products sorted by price
  const { products } = await fetchAllProducts();
  return products
    .filter((p) => p.isActive)
    .sort((a, b) => b.price - a.price)
    .slice(0, 8)
    .map((p) => ({ id: p.id, name: p.name, category: p.categories[0] ?? "", price: p.price, stock: p.stock, revenue: 0 }));
}

export async function getProductList(): Promise<SellerProduct[]> {
  if (useMock()) {
    const { sellerMock } = await import("@/app/lib/mock/sellerMock");
    return sellerMock.productList;
  }
  const { products } = await fetchAllProducts();
  return products.filter((p) => p.isActive).map((p) => ({
    id: p.id,
    name: p.name,
    category: p.categories[0] ?? "Sin categoría",
    price: p.price,
    stock: p.stock,
    revenue: 0,
  }));
}

// Uses seller inventory value (price × stock) per category
export async function getCategoryData(): Promise<CategoryPoint[]> {
  if (useMock()) {
    const { sellerMock } = await import("@/app/lib/mock/sellerMock");
    return sellerMock.categoryData;
  }
  const { products } = await fetchAllProducts();
  const map: Record<string, { count: number; revenue: number }> = {};
  for (const p of products.filter((p) => p.isActive)) {
    const cat = p.categories[0] ?? "Sin categoría";
    if (!map[cat]) map[cat] = { count: 0, revenue: 0 };
    map[cat].count += 1;
    map[cat].revenue += p.price * p.stock;
  }
  return Object.entries(map)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .map(([category, { count, revenue }], i) => ({
      category,
      count,
      revenue,
      color: EARTHY_COLORS[i % EARTHY_COLORS.length],
    }));
}
