import KpiCard from "@/app/ui/KpiCard";
import AppBadge from "@/app/ui/AppBadge";
import { DynamicUserGrowthChart, DynamicWeeklyVolumeChart } from "@/app/ui/DynamicCharts";
import { getBuyerStats, getRecentOrders, getUserGrowth, getWeeklyVolume } from "@/app/lib/services/buyerApi";

export default async function UsersPage() {
  const [stats, recentOrders, userGrowth, weeklyVolume] = await Promise.all([
    getBuyerStats(),
    getRecentOrders(20),
    getUserGrowth(),
    getWeeklyVolume(),
  ]);

  const avgOrdersPerUser = (stats.totalOrders / stats.totalUsers).toFixed(1);

  const recentUsers = recentOrders
    .reduce<{ userId: string; name: string; ordersCount: number; lastOrder: string }[]>((acc, order) => {
      const existing = acc.find((u) => u.userId === order.userId);
      if (existing) {
        existing.ordersCount += 1;
      } else {
        acc.push({ userId: order.userId, name: order.userName, ordersCount: 1, lastOrder: order.createdAt });
      }
      return acc;
    }, [])
    .slice(0, 15);

  return (
    <div className="space-y-8 max-w-screen-2xl">
      {/* KPIs */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
            Indicadores de usuarios
          </h2>
          <AppBadge source="buyer" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Total de usuarios" value={stats.totalUsers.toLocaleString("es-AR")} appSource="buyer" />
          <KpiCard
            label="Activos (30 días)"
            value={stats.activeUsers.toLocaleString("es-AR")}
            delta={5.2}
            deltaPositive
            appSource="buyer"
          />
          <KpiCard
            label="Nuevos (última semana)"
            value={userGrowth[userGrowth.length - 1]?.newUsers ?? 0}
            delta={-33.3}
            deltaPositive={false}
            appSource="buyer"
          />
          <KpiCard
            label="Pedidos por usuario"
            value={avgOrdersPerUser}
            delta={8.1}
            deltaPositive
            appSource="buyer"
          />
        </div>
      </section>

      {/* Charts */}
      <section>
        <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium mb-4">
          Análisis
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DynamicUserGrowthChart data={userGrowth} />
          <DynamicWeeklyVolumeChart data={weeklyVolume} />
        </div>
      </section>

      {/* User activity table derived from orders */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase font-medium">
            Actividad reciente de usuarios
          </h2>
          <AppBadge source="buyer" />
        </div>
        <div className="bg-white rounded-2xl border border-tan shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-tan">
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">ID Usuario</th>
                <th className="text-left text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Nombre</th>
                <th className="text-center text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Pedidos recientes</th>
                <th className="text-right text-xs tracking-[0.15em] text-muted-foreground uppercase px-6 py-3 font-medium">Último pedido</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.userId} className="border-b border-tan/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{user.userId}</td>
                  <td className="px-6 py-4 text-brown font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-olive/10 text-olive text-xs font-medium">
                      {user.ordersCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground text-xs">
                    {new Date(user.lastOrder).toLocaleDateString("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
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
