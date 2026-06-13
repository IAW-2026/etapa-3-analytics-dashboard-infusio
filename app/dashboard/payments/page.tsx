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
          <KpiCard label="Disputas" value={stats.disputed.toLocaleString("es-AR")} delta={-8.7} deltaPositive={false} appSource="payments" />
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

      {/* Disputes Table */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
            Disputas recientes
          </h2>
          <AppBadge source="payments" />
        </div>
        <div className="bg-white rounded-2xl border border-tan shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-tan">
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">ID</th>
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Cliente</th>
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium hidden md:table-cell">Motivo</th>
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Estado</th>
                <th className="text-right text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Monto</th>
                <th className="text-right text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium hidden lg:table-cell">Apertura</th>
              </tr>
            </thead>
            <tbody>
              {recentDisputes.map((dispute) => (
                <tr key={dispute.id} className="border-b border-tan/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{dispute.id}</td>
                  <td className="px-6 py-4 text-brown font-medium">{dispute.userName}</td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">{dispute.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DISPUTE_STYLES[dispute.status] ?? "bg-tan text-brown"}`}>
                      {DISPUTE_LABELS[dispute.status] ?? dispute.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-brown">
                    ${dispute.amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground text-xs hidden lg:table-cell">
                    {new Date(dispute.openedAt).toLocaleDateString("es-AR")}
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
