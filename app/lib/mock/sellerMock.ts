import type { SellerStats, SellerProduct, CategoryPoint } from "@/app/lib/services/sellerApi";

const stats: SellerStats = {
  totalProducts: 94,
  inStock: 78,
  lowStock: 12,
  outOfStock: 4,
  avgRating: 4.3,
  topCategory: "café",
};

const topProducts: SellerProduct[] = [
  { id: "PRD-001", name: "Café Etiopía Yirgacheffe", category: "café", price: 32.0, stock: 48, rating: 4.8, revenue: 18432 },
  { id: "PRD-002", name: "Té Matcha Premium", category: "infusiones", price: 39.0, stock: 31, rating: 4.7, revenue: 12129 },
  { id: "PRD-003", name: "Café Colombia Huila", category: "café", price: 28.5, stock: 62, rating: 4.6, revenue: 10830 },
  { id: "PRD-004", name: "Hervidor Eléctrico Pro", category: "máquinas", price: 142.0, stock: 15, rating: 4.5, revenue: 9656 },
  { id: "PRD-005", name: "Yerba Mate Premium", category: "infusiones", price: 18.0, stock: 87, rating: 4.4, revenue: 8892 },
  { id: "PRD-006", name: "Cafetera Italiana 6 tazas", category: "máquinas", price: 96.0, stock: 23, rating: 4.6, revenue: 7584 },
  { id: "PRD-007", name: "Café Guatemala Antigua", category: "café", price: 29.0, stock: 44, rating: 4.5, revenue: 6844 },
  { id: "PRD-008", name: "Té Verde Sencha", category: "infusiones", price: 25.5, stock: 39, rating: 4.3, revenue: 5355 },
];

const productList: SellerProduct[] = [
  ...topProducts,
  { id: "PRD-009", name: "Prensa Francesa Premium", category: "accesorios", price: 115.0, stock: 18, rating: 4.7, revenue: 4715 },
  { id: "PRD-010", name: "Taza cerámica artesanal", category: "accesorios", price: 19.5, stock: 72, rating: 4.4, revenue: 4485 },
  { id: "PRD-011", name: "Té Negro Ceilán", category: "infusiones", price: 17.0, stock: 55, rating: 4.2, revenue: 4097 },
  { id: "PRD-012", name: "Infusión de Hibiscus", category: "infusiones", price: 22.5, stock: 43, rating: 4.3, revenue: 3825 },
  { id: "PRD-013", name: "Cafetera de goteo 12 tazas", category: "máquinas", price: 129.0, stock: 8, rating: 4.5, revenue: 3741 },
  { id: "PRD-014", name: "Termo Stanley 1L", category: "accesorios", price: 52.0, stock: 34, rating: 4.6, revenue: 3692 },
  { id: "PRD-015", name: "Café Brasil Santos", category: "café", price: 24.0, stock: 70, rating: 4.1, revenue: 3576 },
  { id: "PRD-016", name: "Batidor de matcha", category: "accesorios", price: 37.5, stock: 27, rating: 4.4, revenue: 3337 },
  { id: "PRD-017", name: "Infusión Manzanilla Bio", category: "infusiones", price: 14.0, stock: 91, rating: 4.2, revenue: 3094 },
  { id: "PRD-018", name: "Hervidor Eléctrico Basic", category: "máquinas", price: 94.0, stock: 0, rating: 4.2, revenue: 2820 },
  { id: "PRD-019", name: "Filtros de papel x50", category: "accesorios", price: 11.5, stock: 120, rating: 4.0, revenue: 2703 },
  { id: "PRD-020", name: "Azúcar de caña ecológico", category: "accesorios", price: 20.5, stock: 3, rating: 4.1, revenue: 2419 },
];

const categoryData: CategoryPoint[] = [
  { category: "Café", count: 32, revenue: 58240, color: "#6b7056" },
  { category: "Infusiones", count: 28, revenue: 38110, color: "#9b4a30" },
  { category: "Máquinas", count: 18, revenue: 31290, color: "#7A6C5D" },
  { category: "Accesorios", count: 16, revenue: 15190, color: "#b07d62" },
];

export const sellerMock = {
  stats,
  topProducts,
  productList,
  categoryData,
};
