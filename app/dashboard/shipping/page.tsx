import KpiCard from "@/app/ui/KpiCard";
import AppBadge from "@/app/ui/AppBadge";
import { DynamicShippingStatusChart, DynamicDeliveryTimeChart } from "@/app/ui/DynamicCharts";
import { getShippingStats, getRecentShipments, getShippingStatusData, getDeliveryTimeData, getRiders } from "@/app/lib/services/shippingApi";

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

import ShippingTable from "@/app/ui/tables/ShippingTable";
import RidersTable from "@/app/ui/tables/RidersTable";
import LazySection from "@/app/ui/LazySection";

export default async function ShippingPage() {
  const [stats, recentShipments, statusData, deliveryTimeData, riders] = await Promise.all([
    getShippingStats(),
    getRecentShipments(15),
    getShippingStatusData(),
    getDeliveryTimeData(),
    getRiders(),
  ]);

  return (
    <div className="space-y-8 max-w-screen-2xl">
      {/* KPIs */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-sm tracking-[0.15em] text-muted-foreground uppercase font-semibold">
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
      <LazySection minHeight={340}>
        <section>
          <h2 className="text-sm tracking-[0.15em] text-muted-foreground uppercase font-semibold mb-4">
            Análisis
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DynamicShippingStatusChart data={statusData} successRate={stats.successRate} />
            <DynamicDeliveryTimeChart data={deliveryTimeData} />
          </div>
        </section>
      </LazySection>

      {/* Table */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-sm tracking-[0.15em] text-muted-foreground uppercase font-semibold">
            Envíos recientes
          </h2>
          <AppBadge source="shipping" />
        </div>
        <ShippingTable data={recentShipments} />
      </section>

      {/* Riders */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-sm tracking-[0.15em] text-muted-foreground uppercase font-semibold">
            Repartidores
          </h2>
          <AppBadge source="shipping" />
        </div>
        <RidersTable data={riders} />
      </section>
    </div>
  );
}
