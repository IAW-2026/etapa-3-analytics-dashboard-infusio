import KpiCard from "@/app/ui/KpiCard";
import AppBadge from "@/app/ui/AppBadge";
import {
  DynamicRevenueAreaChart,
  DynamicOrderStatusPieChart,
} from "@/app/ui/DynamicCharts";
import {
  getPaymentStats,
  getRecentDisputes,
  getPaymentsAnalyticsData,
} from "@/app/lib/services/paymentsApi";
import PaymentsTable from "@/app/ui/tables/PaymentsTable";

export default async function PaymentsPage() {
  const [stats, recentDisputes, analyticsData] = await Promise.all([
    getPaymentStats(),
    getRecentDisputes(8),
    getPaymentsAnalyticsData(),
  ]);

  const monthlyRevenue = analyticsData.monthly.map((m) => ({
    date: m.label,
    revenue: m.revenue,
  }));

  const statusDistribution = [
    { status: "Aceptados", count: stats.successfulPayments, color: "#6b7056" },
    { status: "Pendientes", count: stats.disputed, color: "#b07d62" },
    { status: "Cancelados", count: stats.failedPayments, color: "#9b4a30" },
  ];

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
          <DynamicRevenueAreaChart
            data={monthlyRevenue}
            title="Historial de ingresos"
            subtitle="Últimos 6 meses"
          />
          <DynamicOrderStatusPieChart
            data={statusDistribution}
            title="Distribución de transacciones"
            subtitle="Por estado de pago"
          />
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
