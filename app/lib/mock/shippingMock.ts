import type { ShippingStats, Shipment, ShippingStatusPoint, DeliveryTimePoint } from "@/app/lib/services/shippingApi";

const stats: ShippingStats = {
  totalShipments: 2190,
  inTransit: 89,
  delivered: 1876,
  failed: 65,
  processing: 160,
  avgDeliveryDays: 3.2,
  successRate: 85.7,
};

const recentShipments: Shipment[] = [
  { id: "SHP-4821", orderId: "ORD-2341", status: "delivered", carrier: "OCA", destinationCity: "Buenos Aires", createdAt: "2026-06-05T08:00:00Z", deliveredAt: "2026-06-08T14:30:00Z" },
  { id: "SHP-4820", orderId: "ORD-2340", status: "in_transit", carrier: "Andreani", destinationCity: "Córdoba", createdAt: "2026-06-10T09:00:00Z", deliveredAt: null },
  { id: "SHP-4819", orderId: "ORD-2339", status: "processing", carrier: "Correo Argentino", destinationCity: "Rosario", createdAt: "2026-06-12T08:00:00Z", deliveredAt: null },
  { id: "SHP-4818", orderId: "ORD-2338", status: "delivered", carrier: "OCA", destinationCity: "Mendoza", createdAt: "2026-06-07T10:00:00Z", deliveredAt: "2026-06-10T11:00:00Z" },
  { id: "SHP-4817", orderId: "ORD-2337", status: "delivered", carrier: "Andreani", destinationCity: "Buenos Aires", createdAt: "2026-06-06T11:00:00Z", deliveredAt: "2026-06-09T16:00:00Z" },
  { id: "SHP-4816", orderId: "ORD-2336", status: "in_transit", carrier: "OCA", destinationCity: "La Plata", createdAt: "2026-06-11T07:00:00Z", deliveredAt: null },
  { id: "SHP-4815", orderId: "ORD-2335", status: "delivered", carrier: "Correo Argentino", destinationCity: "Salta", createdAt: "2026-06-04T12:00:00Z", deliveredAt: "2026-06-09T10:00:00Z" },
  { id: "SHP-4814", orderId: "ORD-2333", status: "delivered", carrier: "Andreani", destinationCity: "Buenos Aires", createdAt: "2026-06-03T09:00:00Z", deliveredAt: "2026-06-05T15:00:00Z" },
  { id: "SHP-4813", orderId: "ORD-2332", status: "delivered", carrier: "OCA", destinationCity: "Tucumán", createdAt: "2026-06-03T10:00:00Z", deliveredAt: "2026-06-07T12:00:00Z" },
  { id: "SHP-4812", orderId: "ORD-2331", status: "failed", carrier: "Correo Argentino", destinationCity: "Mar del Plata", createdAt: "2026-06-01T11:00:00Z", deliveredAt: null },
  { id: "SHP-4811", orderId: "ORD-2329", status: "delivered", carrier: "Andreani", destinationCity: "Buenos Aires", createdAt: "2026-05-31T08:00:00Z", deliveredAt: "2026-06-03T14:00:00Z" },
  { id: "SHP-4810", orderId: "ORD-2328", status: "delivered", carrier: "OCA", destinationCity: "Córdoba", createdAt: "2026-05-30T09:00:00Z", deliveredAt: "2026-06-02T13:00:00Z" },
  { id: "SHP-4809", orderId: "ORD-2327", status: "in_transit", carrier: "Andreani", destinationCity: "Rosario", createdAt: "2026-06-11T13:00:00Z", deliveredAt: null },
  { id: "SHP-4808", orderId: "ORD-2326", status: "delivered", carrier: "Correo Argentino", destinationCity: "San Juan", createdAt: "2026-05-29T10:00:00Z", deliveredAt: "2026-06-04T09:00:00Z" },
  { id: "SHP-4807", orderId: "ORD-2324", status: "delivered", carrier: "OCA", destinationCity: "Buenos Aires", createdAt: "2026-05-28T08:00:00Z", deliveredAt: "2026-05-30T16:00:00Z" },
];

const statusData: ShippingStatusPoint[] = [
  { status: "Entregados", count: 1876, color: "#6b7056" },
  { status: "En tránsito", count: 89, color: "#b07d62" },
  { status: "Procesando", count: 160, color: "#8B7355" },
  { status: "Fallidos", count: 65, color: "#9b4a30" },
];

const deliveryTimeData: DeliveryTimePoint[] = [
  { days: "1 día", count: 312 },
  { days: "2 días", count: 548 },
  { days: "3 días", count: 621 },
  { days: "4 días", count: 245 },
  { days: "5 días", count: 98 },
  { days: "6+ días", count: 52 },
];

export const shippingMock = {
  stats,
  recentShipments,
  statusData,
  deliveryTimeData,
};
