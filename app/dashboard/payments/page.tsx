import KpiCard from "@/app/ui/KpiCard";
import AppBadge from "@/app/ui/AppBadge";
import { DynamicPaymentMethodsChart, DynamicDisputesTrendChart } from "@/app/ui/DynamicCharts";
import { getPaymentStats, getRecentDisputes, getDisputesTrend, getPaymentMethods } from "@/app/lib/services/paymentsApi";

const DISPUTE_STYLES: Record<string, string> = {
  open: "bg-yellow-50 text-yellow-700",
  resolved: "bg-olive/10 text-olive",
  rejected: "bg-red-50 text-red-700",
};

const DISPUTE_LABELS: Record<string, string> = {
  open: "Abierta",
  resolved: "Resuelta",
  rejected: "Rechazada",
};

import PaymentsTable from "@/app/ui/tables/PaymentsTable";

export default async function PaymentsPage() {
  const [stats, recentDisputes, disputesTrend, paymentMethods] = await Promise.all([
    getPaymentStats(),
    getRecentDisputes(8),
    getDisputesTrend(),
    getPaymentMethods(),
  ]);

  return (
    <div className="space-y-8 max-w-screen-2xl">
      {/* KPIs */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
            Indicadores de pagos
          </h2>
          <AppBadge source="payments" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard
            label="Ingresos totales"
            value={`$${stats.totalRevenue.toLocaleString("es-AR")}`}
            delta={8.4}
            deltaPositive
            appSource="payments"
          />
          <KpiCard label="Pagos exitosos" value={stats.successfulPayments.toLocaleString("es-AR")} delta={3.2} deltaPositive appSource="payments" />
          <KpiCard label="Pagos fallidos" value={stats.failedPayments.toLocaleString("es-AR")} delta={-12.0} deltaPositive={false} appSource="payments" />
          <KpiCard label="Pagos pendientes" value={stats.disputed.toLocaleString("es-AR")} delta={-8.7} deltaPositive={false} appSource="payments" />
          <KpiCard
            label="Transacción promedio"
            value={`$${stats.avgTransactionValue.toFixed(2)}`}
            delta={2.1}
            deltaPositive
            appSource="payments"
          />
        </div>
      </section>

      {/* Charts */}
      <section>
        <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium mb-4">
          Análisis
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DynamicPaymentMethodsChart data={paymentMethods} />
          <DynamicDisputesTrendChart data={disputesTrend} />
        </div>
      </section>

      {/* Recent Payments Table */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
            Pagos recientes
          </h2>
          <AppBadge source="payments" />
        </div>
        <PaymentsTable data={recentDisputes} />
      </section>
    </div>
  );
}
