import KpiCard from "@/app/ui/KpiCard";
import AppBadge from "@/app/ui/AppBadge";
import { DynamicShippingStatusChart, DynamicDeliveryTimeChart } from "@/app/ui/DynamicCharts";
import { getShippingStats, getRecentShipments, getShippingStatusData, getDeliveryTimeData } from "@/app/lib/services/shippingApi";

const SHIPMENT_STYLES: Record<string, string> = {
  delivered: "bg-olive/10 text-olive",
  in_transit: "bg-blue-50 text-blue-700",
  processing: "bg-yellow-50 text-yellow-700",
  failed: "bg-red-50 text-red-700",
};

const SHIPMENT_LABELS: Record<string, string> = {
  delivered: "Entregado",
  in_transit: "En tránsito",
  processing: "Procesando",
  failed: "Fallido",
};

export default async function ShippingPage() {
  const [stats, recentShipments, statusData, deliveryTimeData] = await Promise.all([
    getShippingStats(),
    getRecentShipments(15),
    getShippingStatusData(),
    getDeliveryTimeData(),
  ]);

  return (
    <div className="space-y-8 max-w-screen-2xl">
      {/* KPIs */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
            Indicadores de envíos
          </h2>
          <AppBadge source="shipping" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard label="Total de envíos" value={stats.totalShipments.toLocaleString("es-AR")} appSource="shipping" />
          <KpiCard label="Entregados" value={stats.delivered.toLocaleString("es-AR")} delta={3.1} deltaPositive appSource="shipping" />
          <KpiCard label="En tránsito" value={stats.inTransit.toLocaleString("es-AR")} appSource="shipping" />
          <KpiCard label="Fallidos" value={stats.failed.toLocaleString("es-AR")} delta={-8.2} deltaPositive={false} appSource="shipping" />
          <KpiCard
            label="Tiempo promedio"
            value={`${stats.avgDeliveryDays} días`}
            delta={-12.5}
            deltaPositive
            appSource="shipping"
          />
        </div>
      </section>

      {/* Charts */}
      <section>
        <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium mb-4">
          Análisis
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DynamicShippingStatusChart data={statusData} successRate={stats.successRate} />
          <DynamicDeliveryTimeChart data={deliveryTimeData} />
        </div>
      </section>

      {/* Table */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
            Envíos recientes
          </h2>
          <AppBadge source="shipping" />
        </div>
        <div className="bg-white rounded-2xl border border-tan shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-tan">
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">ID Envío</th>
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium hidden md:table-cell">Pedido</th>
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Destino</th>
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium hidden lg:table-cell">Transportista</th>
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Estado</th>
                <th className="text-right text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium hidden md:table-cell">Fecha envío</th>
              </tr>
            </thead>
            <tbody>
              {recentShipments.map((shipment) => (
                <tr key={shipment.id} className="border-b border-tan/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{shipment.id}</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground hidden md:table-cell">{shipment.orderId}</td>
                  <td className="px-6 py-4 text-brown font-medium">{shipment.destinationCity}</td>
                  <td className="px-6 py-4 text-muted-foreground hidden lg:table-cell">{shipment.carrier}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SHIPMENT_STYLES[shipment.status] ?? "bg-tan text-brown"}`}>
                      {SHIPMENT_LABELS[shipment.status] ?? shipment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground text-xs hidden md:table-cell">
                    {new Date(shipment.createdAt).toLocaleDateString("es-AR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
