import type { PaymentsAnalyticsResponse } from "@/app/lib/services/paymentsApi";

export const paymentsMock: PaymentsAnalyticsResponse = {
  totals: {
    orders: 342,
    revenue: 142830,
    accepted: 310,
    pending: 23,
    cancelled: 9,
    uniqueBuyers: 89,
    successRate: 91,
  },
  monthly: [
    { month: 1, year: 2026, label: "Ene", orders: 45, revenue: 18200 },
    { month: 2, year: 2026, label: "Feb", orders: 52, revenue: 21500 },
    { month: 3, year: 2026, label: "Mar", orders: 58, revenue: 24300 },
    { month: 4, year: 2026, label: "Abr", orders: 61, revenue: 25900 },
    { month: 5, year: 2026, label: "May", orders: 64, revenue: 27200 },
    { month: 6, year: 2026, label: "Jun", orders: 62, revenue: 25730 },
  ],
  recentOrders: [
    { id: "PAY-1892", amount: 87.5, status: "accepted", buyerId: "user_2183", sellerAppOrderId: "ORD-2287", createdAt: "2026-06-10T14:00:00Z" },
    { id: "PAY-1847", amount: 142.0, status: "pending", buyerId: "user_8722", sellerAppOrderId: "ORD-2242", createdAt: "2026-06-08T11:30:00Z" },
    { id: "PAY-1812", amount: 39.0, status: "accepted", buyerId: "user_9011", sellerAppOrderId: "ORD-2207", createdAt: "2026-06-05T09:00:00Z" },
    { id: "PAY-1789", amount: 96.0, status: "cancelled", buyerId: "user_1190", sellerAppOrderId: "ORD-2184", createdAt: "2026-06-01T16:00:00Z" },
    { id: "PAY-1756", amount: 54.0, status: "pending", buyerId: "user_5411", sellerAppOrderId: "ORD-2151", createdAt: "2026-05-28T10:00:00Z" },
    { id: "PAY-1723", amount: 115.0, status: "accepted", buyerId: "user_7612", sellerAppOrderId: "ORD-2118", createdAt: "2026-05-24T12:00:00Z" },
    { id: "PAY-1698", amount: 68.5, status: "accepted", buyerId: "user_3901", sellerAppOrderId: "ORD-2093", createdAt: "2026-05-20T15:00:00Z" },
    { id: "PAY-1671", amount: 76.5, status: "accepted", buyerId: "user_2901", sellerAppOrderId: "ORD-2066", createdAt: "2026-05-15T08:00:00Z" },
  ],
};
