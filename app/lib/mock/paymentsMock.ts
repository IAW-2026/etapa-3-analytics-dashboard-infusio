import type { PaymentStats, Dispute, DisputePoint, PaymentMethodPoint } from "@/app/lib/services/paymentsApi";

const stats: PaymentStats = {
  totalRevenue: 142830,
  successfulPayments: 2106,
  failedPayments: 78,
  disputed: 23,
  refunded: 18,
  avgTransactionValue: 67.82,
  conversionRate: 96.4,
};

const recentDisputes: Dispute[] = [
  { id: "DSP-023", paymentId: "PAY-1892", orderId: "ORD-2287", userName: "Federico Ruiz", amount: 87.5, reason: "Producto no recibido", status: "open", openedAt: "2026-06-10T14:00:00Z", resolvedAt: null },
  { id: "DSP-022", paymentId: "PAY-1847", orderId: "ORD-2242", userName: "Marina Castillo", amount: 142.0, reason: "Producto dañado al llegar", status: "open", openedAt: "2026-06-08T11:30:00Z", resolvedAt: null },
  { id: "DSP-021", paymentId: "PAY-1812", orderId: "ORD-2207", userName: "Rodrigo Benítez", amount: 39.0, reason: "Cargo incorrecto", status: "resolved", openedAt: "2026-06-05T09:00:00Z", resolvedAt: "2026-06-09T10:00:00Z" },
  { id: "DSP-020", paymentId: "PAY-1789", orderId: "ORD-2184", userName: "Paula Méndez", amount: 96.0, reason: "Producto no recibido", status: "resolved", openedAt: "2026-06-01T16:00:00Z", resolvedAt: "2026-06-06T14:00:00Z" },
  { id: "DSP-019", paymentId: "PAY-1756", orderId: "ORD-2151", userName: "Hernán Gutiérrez", amount: 54.0, reason: "Artículo incorrecto enviado", status: "open", openedAt: "2026-05-28T10:00:00Z", resolvedAt: null },
  { id: "DSP-018", paymentId: "PAY-1723", orderId: "ORD-2118", userName: "Celeste Navarro", amount: 115.0, reason: "Cargo incorrecto", status: "resolved", openedAt: "2026-05-24T12:00:00Z", resolvedAt: "2026-05-30T09:00:00Z" },
  { id: "DSP-017", paymentId: "PAY-1698", orderId: "ORD-2093", userName: "Gonzalo Peralta", amount: 68.5, reason: "Producto dañado al llegar", status: "resolved", openedAt: "2026-05-20T15:00:00Z", resolvedAt: "2026-05-26T11:00:00Z" },
  { id: "DSP-016", paymentId: "PAY-1671", orderId: "ORD-2066", userName: "Daniela Acosta", amount: 76.5, reason: "Producto no recibido", status: "resolved", openedAt: "2026-05-15T08:00:00Z", resolvedAt: "2026-05-21T14:00:00Z" },
];

const disputesTrend: DisputePoint[] = [
  { week: "15 Dic", count: 2 }, { week: "22 Dic", count: 1 }, { week: "29 Dic", count: 0 },
  { week: "05 Ene", count: 2 }, { week: "12 Ene", count: 3 }, { week: "19 Ene", count: 1 },
  { week: "26 Ene", count: 2 }, { week: "02 Feb", count: 3 }, { week: "09 Feb", count: 2 },
  { week: "16 Feb", count: 1 }, { week: "23 Feb", count: 2 }, { week: "02 Mar", count: 2 },
  { week: "09 Mar", count: 3 }, { week: "16 Mar", count: 2 }, { week: "23 Mar", count: 1 },
  { week: "30 Mar", count: 2 }, { week: "06 Abr", count: 1 }, { week: "13 Abr", count: 2 },
  { week: "20 Abr", count: 1 }, { week: "27 Abr", count: 0 }, { week: "04 May", count: 1 },
  { week: "11 May", count: 2 }, { week: "18 May", count: 1 }, { week: "25 May", count: 2 },
  { week: "01 Jun", count: 3 }, { week: "08 Jun", count: 2 },
];

const paymentMethods: PaymentMethodPoint[] = [
  { method: "Tarjeta de crédito", count: 1306, percentage: 62, color: "#6b7056" },
  { method: "Tarjeta de débito", count: 442, percentage: 21, color: "#9b4a30" },
  { method: "Transferencia", count: 358, percentage: 17, color: "#7A6C5D" },
];

export const paymentsMock = {
  stats,
  recentDisputes,
  disputesTrend,
  paymentMethods,
};
