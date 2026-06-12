import type { BuyerStats, BuyerOrder, UserGrowthPoint, RevenuePoint, WeeklyVolumePoint, OrderStatusPoint } from "@/app/lib/services/buyerApi";

const stats: BuyerStats = {
  totalUsers: 847,
  activeUsers: 312,
  totalOrders: 2341,
  completedOrders: 1987,
  pendingOrders: 203,
  cancelledOrders: 151,
  totalRevenue: 142830,
  avgOrderValue: 61.06,
};

const recentOrders: BuyerOrder[] = [
  { id: "ORD-2341", userId: "usr_001", userName: "Valentina Sosa", status: "CONFIRMED", total: 87.5, createdAt: "2026-06-12T10:24:00Z", items: [{ productName: "Café Etiopía Yirgacheffe", quantity: 2, price: 32.0 }, { productName: "Té Verde Sencha", quantity: 1, price: 23.5 }] },
  { id: "ORD-2340", userId: "usr_045", userName: "Martín Herrera", status: "CONFIRMED", total: 142.0, createdAt: "2026-06-12T09:11:00Z", items: [{ productName: "Hervidor Eléctrico Pro", quantity: 1, price: 142.0 }] },
  { id: "ORD-2339", userId: "usr_112", userName: "Lucía Fernández", status: "PENDING", total: 54.0, createdAt: "2026-06-12T08:47:00Z", items: [{ productName: "Yerba Mate Premium", quantity: 3, price: 18.0 }] },
  { id: "ORD-2338", userId: "usr_203", userName: "Agustín Romero", status: "CONFIRMED", total: 68.5, createdAt: "2026-06-11T19:33:00Z", items: [{ productName: "Café Colombia Huila", quantity: 2, price: 28.5 }, { productName: "Filtros de papel x50", quantity: 1, price: 11.5 }] },
  { id: "ORD-2337", userId: "usr_078", userName: "Camila Díaz", status: "CONFIRMED", total: 96.0, createdAt: "2026-06-11T17:55:00Z", items: [{ productName: "Cafetera Italiana 6 tazas", quantity: 1, price: 96.0 }] },
  { id: "ORD-2336", userId: "usr_155", userName: "Facundo Paz", status: "AWAITING_PAYMENT", total: 39.0, createdAt: "2026-06-11T15:20:00Z", items: [{ productName: "Té Matcha Premium", quantity: 1, price: 39.0 }] },
  { id: "ORD-2335", userId: "usr_290", userName: "Sofía Villanueva", status: "CONFIRMED", total: 77.5, createdAt: "2026-06-11T13:08:00Z", items: [{ productName: "Café Guatemala Antigua", quantity: 2, price: 29.0 }, { productName: "Taza cerámica artesanal", quantity: 1, price: 19.5 }] },
  { id: "ORD-2334", userId: "usr_034", userName: "Ignacio Castro", status: "CANCELLED", total: 45.0, createdAt: "2026-06-11T11:44:00Z", items: [{ productName: "Infusión de Hibiscus", quantity: 2, price: 22.5 }] },
  { id: "ORD-2333", userId: "usr_187", userName: "Florencia López", status: "CONFIRMED", total: 115.0, createdAt: "2026-06-10T20:30:00Z", items: [{ productName: "Prensa Francesa Premium", quantity: 1, price: 115.0 }] },
  { id: "ORD-2332", userId: "usr_067", userName: "Tomás Álvarez", status: "CONFIRMED", total: 52.5, createdAt: "2026-06-10T18:15:00Z", items: [{ productName: "Café Etiopía Yirgacheffe", quantity: 1, price: 32.0 }, { productName: "Azúcar de caña ecológico", quantity: 1, price: 20.5 }] },
  { id: "ORD-2331", userId: "usr_321", userName: "Bianca Torres", status: "CONFIRMED", total: 88.0, createdAt: "2026-06-10T16:00:00Z", items: [{ productName: "Yerba Mate Premium", quantity: 2, price: 18.0 }, { productName: "Termo Stanley 1L", quantity: 1, price: 52.0 }] },
  { id: "ORD-2330", userId: "usr_099", userName: "Nicolás Reyes", status: "PENDING", total: 34.0, createdAt: "2026-06-10T14:22:00Z", items: [{ productName: "Té Negro Ceilán", quantity: 2, price: 17.0 }] },
  { id: "ORD-2329", userId: "usr_214", userName: "Antonella Gómez", status: "CONFIRMED", total: 129.0, createdAt: "2026-06-09T21:10:00Z", items: [{ productName: "Cafetera de goteo 12 tazas", quantity: 1, price: 129.0 }] },
  { id: "ORD-2328", userId: "usr_043", userName: "Ramiro Silva", status: "CONFIRMED", total: 64.0, createdAt: "2026-06-09T19:48:00Z", items: [{ productName: "Café Colombia Huila", quantity: 2, price: 28.5 }, { productName: "Molinillo de café manual", quantity: 1, price: 7.0 }] },
  { id: "ORD-2327", userId: "usr_178", userName: "Macarena Ríos", status: "AWAITING_PAYMENT", total: 76.5, createdAt: "2026-06-09T17:33:00Z", items: [{ productName: "Té Matcha Premium", quantity: 1, price: 39.0 }, { productName: "Batidor de matcha", quantity: 1, price: 37.5 }] },
  { id: "ORD-2326", userId: "usr_256", userName: "Esteban Morales", status: "CONFIRMED", total: 48.0, createdAt: "2026-06-08T20:05:00Z", items: [{ productName: "Infusión Manzanilla Bio", quantity: 2, price: 14.0 }, { productName: "Infusión de Hibiscus", quantity: 1, price: 20.0 }] },
  { id: "ORD-2325", userId: "usr_133", userName: "Julieta Ponce", status: "CANCELLED", total: 32.0, createdAt: "2026-06-08T16:30:00Z", items: [{ productName: "Café Guatemala Antigua", quantity: 1, price: 32.0 }] },
  { id: "ORD-2324", userId: "usr_067", userName: "Tomás Álvarez", status: "CONFIRMED", total: 94.0, createdAt: "2026-06-07T11:45:00Z", items: [{ productName: "Hervidor Eléctrico Basic", quantity: 1, price: 94.0 }] },
  { id: "ORD-2323", userId: "usr_389", userName: "Catalina Muñoz", status: "CONFIRMED", total: 57.5, createdAt: "2026-06-07T09:20:00Z", items: [{ productName: "Café Etiopía Yirgacheffe", quantity: 1, price: 32.0 }, { productName: "Té Verde Sencha", quantity: 1, price: 25.5 }] },
  { id: "ORD-2322", userId: "usr_201", userName: "Sebastián Vera", status: "CONFIRMED", total: 112.0, createdAt: "2026-06-06T15:00:00Z", items: [{ productName: "Cafetera Italiana 6 tazas", quantity: 1, price: 96.0 }, { productName: "Café Colombia Huila", quantity: 1, price: 16.0 }] },
];

const userGrowth: UserGrowthPoint[] = [
  { date: "15 Dic", newUsers: 5, totalUsers: 671 },
  { date: "22 Dic", newUsers: 4, totalUsers: 675 },
  { date: "29 Dic", newUsers: 6, totalUsers: 681 },
  { date: "05 Ene", newUsers: 9, totalUsers: 690 },
  { date: "12 Ene", newUsers: 11, totalUsers: 701 },
  { date: "19 Ene", newUsers: 8, totalUsers: 709 },
  { date: "26 Ene", newUsers: 7, totalUsers: 716 },
  { date: "02 Feb", newUsers: 10, totalUsers: 726 },
  { date: "09 Feb", newUsers: 12, totalUsers: 738 },
  { date: "16 Feb", newUsers: 9, totalUsers: 747 },
  { date: "23 Feb", newUsers: 7, totalUsers: 754 },
  { date: "02 Mar", newUsers: 8, totalUsers: 762 },
  { date: "09 Mar", newUsers: 11, totalUsers: 773 },
  { date: "16 Mar", newUsers: 13, totalUsers: 786 },
  { date: "23 Mar", newUsers: 10, totalUsers: 796 },
  { date: "30 Mar", newUsers: 6, totalUsers: 802 },
  { date: "06 Abr", newUsers: 7, totalUsers: 809 },
  { date: "13 Abr", newUsers: 9, totalUsers: 818 },
  { date: "20 Abr", newUsers: 5, totalUsers: 823 },
  { date: "27 Abr", newUsers: 4, totalUsers: 827 },
  { date: "04 May", newUsers: 3, totalUsers: 830 },
  { date: "11 May", newUsers: 4, totalUsers: 834 },
  { date: "18 May", newUsers: 3, totalUsers: 837 },
  { date: "25 May", newUsers: 4, totalUsers: 841 },
  { date: "01 Jun", newUsers: 4, totalUsers: 845 },
  { date: "08 Jun", newUsers: 2, totalUsers: 847 },
];

const revenueData: RevenuePoint[] = [
  { date: "13 May", revenue: 4120 }, { date: "14 May", revenue: 3840 }, { date: "15 May", revenue: 5210 },
  { date: "16 May", revenue: 4780 }, { date: "17 May", revenue: 3290 }, { date: "18 May", revenue: 2850 },
  { date: "19 May", revenue: 4560 }, { date: "20 May", revenue: 5340 }, { date: "21 May", revenue: 4900 },
  { date: "22 May", revenue: 4230 }, { date: "23 May", revenue: 3970 }, { date: "24 May", revenue: 3100 },
  { date: "25 May", revenue: 2750 }, { date: "26 May", revenue: 4680 }, { date: "27 May", revenue: 5120 },
  { date: "28 May", revenue: 4850 }, { date: "29 May", revenue: 4410 }, { date: "30 May", revenue: 3760 },
  { date: "31 May", revenue: 2980 }, { date: "01 Jun", revenue: 2640 }, { date: "02 Jun", revenue: 4920 },
  { date: "03 Jun", revenue: 5560 }, { date: "04 Jun", revenue: 5180 }, { date: "05 Jun", revenue: 4430 },
  { date: "06 Jun", revenue: 4070 }, { date: "07 Jun", revenue: 3250 }, { date: "08 Jun", revenue: 2820 },
  { date: "09 Jun", revenue: 5010 }, { date: "10 Jun", revenue: 5440 }, { date: "11 Jun", revenue: 4980 },
];

const weeklyVolume: WeeklyVolumePoint[] = [
  { week: "14 Abr", transactions: 198 }, { week: "21 Abr", transactions: 187 },
  { week: "28 Abr", transactions: 203 }, { week: "05 May", transactions: 215 },
  { week: "12 May", transactions: 234 }, { week: "19 May", transactions: 248 },
  { week: "26 May", transactions: 261 }, { week: "02 Jun", transactions: 273 },
];

const orderStatusData: OrderStatusPoint[] = [
  { status: "Completados", count: 1987, color: "#6b7056" },
  { status: "Pendientes", count: 203, color: "#b07d62" },
  { status: "Cancelados", count: 151, color: "#9b4a30" },
];

export const buyerMock = {
  stats,
  recentOrders,
  userGrowth,
  revenueData,
  weeklyVolume,
  orderStatusData,
};
