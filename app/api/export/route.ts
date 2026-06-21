export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import {
  renderToBuffer,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import React from "react";
import { getBuyerAnalytics } from "@/app/lib/services/buyerApi";
import { getSellerStats, getTopProducts } from "@/app/lib/services/sellerApi";
import { getShippingStats } from "@/app/lib/services/shippingApi";
import { getPaymentStats } from "@/app/lib/services/paymentsApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function esc(value: string | number | null | undefined): string {
  const s = String(value ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}
function csvRow(...cells: (string | number)[]): string {
  return cells.map(esc).join(",");
}
function formatDate(date: Date): string {
  return date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function pct(part: number, total: number): string {
  return total > 0 ? `${((part / total) * 100).toFixed(1)}%` : "0%";
}

// ─── PDF styles ───────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page:          { fontFamily: "Helvetica", fontSize: 9, color: "#2d2926", padding: "0.8cm 1.5cm", backgroundColor: "#ffffff" },
  // header
  header:        { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  brand:         { fontSize: 15, letterSpacing: 3 },
  brandSub:      { fontSize: 6, letterSpacing: 2, color: "#8a8278", marginTop: 2 },
  reportTitle:   { fontSize: 9, textAlign: "right" },
  reportDate:    { fontSize: 6, color: "#8a8278", textAlign: "right", marginTop: 2, letterSpacing: 1 },
  hr:            { borderBottomWidth: 0.5, borderBottomColor: "#d4cfc5", marginVertical: 8 },
  hrThin:        { borderBottomWidth: 0.5, borderBottomColor: "#ede9e3", marginVertical: 5 },
  // KPI tiles
  kpiRow:        { flexDirection: "row", gap: 8, marginBottom: 10 },
  kpiBlock:      { flex: 1, borderWidth: 0.5, borderColor: "#d4cfc5", padding: "5 8" },
  kpiLabel:      { fontSize: 5.5, letterSpacing: 2.5, color: "#8a8278", marginBottom: 3, fontFamily: "Helvetica-Bold" },
  kpiValue:      { fontSize: 13, color: "#2d2926", marginBottom: 2 },
  kpiSub:        { fontSize: 6, color: "#5a5450" },
  // Two-column layout
  twoCol:        { flexDirection: "row", gap: 16, flex: 1 },
  colLeft:       { flex: 1 },
  colRight:      { width: 185 },
  // Section titles
  sectionTitle:  { fontSize: 6.5, letterSpacing: 2, color: "#8a8278", fontFamily: "Helvetica-Bold", marginBottom: 4, marginTop: 1 },
  // Mini table (for distributions)
  miniRow:       { flexDirection: "row", paddingVertical: 3.5, borderBottomWidth: 0.5, borderBottomColor: "#ede9e3" },
  miniRowHead:   { flexDirection: "row", paddingVertical: 3, borderBottomWidth: 1, borderBottomColor: "#d4cfc5", marginBottom: 1 },
  miniCell:      { fontSize: 7, color: "#2d2926", flex: 1 },
  miniCellBold:  { fontSize: 7, color: "#2d2926", flex: 1, fontFamily: "Helvetica-Bold" },
  miniCellRight: { fontSize: 7, color: "#5a5450", width: 50, textAlign: "right" },
  miniCellPct:   { fontSize: 7, color: "#8a8278", width: 40, textAlign: "right" },
  // Main table
  tableHead:     { flexDirection: "row", backgroundColor: "#2d2926", paddingVertical: 5 },
  tableHeadCell: { fontSize: 6, letterSpacing: 1.5, color: "#f5f3ef", fontFamily: "Helvetica-Bold", paddingHorizontal: 5 },
  tableRow:      { flexDirection: "row", paddingVertical: 5, borderBottomWidth: 0.5, borderBottomColor: "#ede9e3" },
  tableRowAlt:   { flexDirection: "row", paddingVertical: 5, borderBottomWidth: 0.5, borderBottomColor: "#ede9e3", backgroundColor: "#faf8f5" },
  cell:          { fontSize: 7, color: "#2d2926", paddingHorizontal: 5 },
  cellMuted:     { fontSize: 7, color: "#8a8278", paddingHorizontal: 5 },
  cellRight:     { fontSize: 7, color: "#2d2926", paddingHorizontal: 5, textAlign: "right" },
  cellRightMuted:{ fontSize: 7, color: "#8a8278", paddingHorizontal: 5, textAlign: "right" },
  // Stat block (compact KV pairs)
  statBlock:     { borderWidth: 0.5, borderColor: "#d4cfc5", padding: "5 8", marginBottom: 6 },
  statBlockTitle:{ fontSize: 6, letterSpacing: 2, color: "#8a8278", fontFamily: "Helvetica-Bold", marginBottom: 4 },
  statRow:       { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2, borderBottomWidth: 0.5, borderBottomColor: "#f0ede8" },
  statLabel:     { fontSize: 7, color: "#5a5450" },
  statValue:     { fontSize: 7, color: "#2d2926", fontFamily: "Helvetica-Bold" },
  // Footer
  footer:        { marginTop: 8, borderTopWidth: 0.5, borderTopColor: "#d4cfc5", paddingTop: 6, flexDirection: "row", justifyContent: "space-between" },
  footerText:    { fontSize: 6.5, color: "#8a8278", letterSpacing: 0.5 },
});

// ─── Reusable PDF primitives ──────────────────────────────────────────────────

const HR = () => React.createElement(View, { style: s.hr });
const HR_THIN = () => React.createElement(View, { style: s.hrThin });
const SectionTitle = (title: string) => React.createElement(Text, { style: s.sectionTitle }, title);

function StatBlock(title: string, rows: [string, string][]) {
  return React.createElement(View, { style: s.statBlock },
    React.createElement(Text, { style: s.statBlockTitle }, title),
    ...rows.map(([label, value], i) =>
      React.createElement(View, { key: i, style: s.statRow },
        React.createElement(Text, { style: s.statLabel }, label),
        React.createElement(Text, { style: s.statValue }, value)
      )
    )
  );
}

function MiniTable(headers: string[], rows: string[][], widths?: number[]) {
  const getCellStyle = (j: number) =>
    j === 0 ? s.miniCell : j === rows[0]?.length - 1 ? s.miniCellPct : s.miniCellRight;

  return React.createElement(View, null,
    React.createElement(View, { style: s.miniRowHead },
      ...headers.map((h, j) =>
        React.createElement(Text, { key: j, style: { ...s.miniCellBold, ...(widths ? { flex: undefined, width: widths[j] } : {}) } }, h)
      )
    ),
    ...rows.map((row, i) =>
      React.createElement(View, { key: i, style: s.miniRow },
        ...row.map((cell, j) =>
          React.createElement(Text, { key: j, style: { ...getCellStyle(j), ...(widths ? { flex: undefined, width: widths[j] } : {}) } }, cell)
        )
      )
    )
  );
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const format = new URL(req.url).searchParams.get("format") ?? "csv";

  const [analytics, sellerStats, topSellerProducts, shippingStats, paymentStats] =
    await Promise.all([
      getBuyerAnalytics(),
      getSellerStats(),
      getTopProducts(),
      getShippingStats(),
      getPaymentStats(),
    ]);

  const { overview, revenueTimeSeries, topProducts, orderStatusDistribution, favourites } = analytics;
  const generatedOn = formatDate(new Date());
  const avgOrder = overview.totalOrders > 0 ? Math.round(overview.totalRevenue / overview.totalOrders) : 0;
  const abandonmentRate = overview.totalUsers > 0 ? pct(overview.abandonedCarts, overview.totalUsers) : "0%";
  const cancellationRate = pct(overview.cancelledOrders, overview.totalOrders);

  // ─── CSV ──────────────────────────────────────────────────────────────────

  if (format === "csv") {
    const lines: string[] = [];
    lines.push(csvRow("INFUSIO — Reporte Analytics", `Generado el ${generatedOn}`));
    lines.push("");
    lines.push("RESUMEN GENERAL");
    lines.push(csvRow("Métrica", "Valor"));
    lines.push(csvRow("Ingresos totales", `$${overview.totalRevenue.toLocaleString("es-AR")}`));
    lines.push(csvRow("Total de pedidos", overview.totalOrders));
    lines.push(csvRow("Pedidos confirmados", overview.confirmedOrders));
    lines.push(csvRow("Pedidos cancelados", overview.cancelledOrders));
    lines.push(csvRow("Pedidos activos", overview.activeOrders));
    lines.push(csvRow("Ticket promedio", `$${avgOrder.toLocaleString("es-AR")}`));
    lines.push(csvRow("Usuarios totales", overview.totalUsers));
    lines.push(csvRow("Nuevos usuarios (30d)", overview.newUsersLast30Days));
    lines.push(csvRow("Carritos abandonados", overview.abandonedCarts));
    lines.push(csvRow("Valor abandonado", `$${overview.abandonedCartValue.toLocaleString("es-AR")}`));
    lines.push(csvRow("Tasa de abandono", abandonmentRate));
    lines.push("");
    lines.push("DISTRIBUCIÓN DE ESTADOS");
    lines.push(csvRow("Estado", "Cantidad", "%"));
    for (const st of orderStatusDistribution) lines.push(csvRow(st.status, st.count, pct(st.count, overview.totalOrders)));
    lines.push("");
    lines.push("INGRESOS MENSUALES");
    lines.push(csvRow("Mes", "Ingresos"));
    for (const m of revenueTimeSeries.monthly) lines.push(csvRow(m.month, `$${m.revenue.toLocaleString("es-AR")}`));
    lines.push("");
    lines.push("TOP PRODUCTOS (BUYER APP)");
    lines.push(csvRow("Producto", "Ingresos", "Unidades", "P. unitario prom."));
    for (const p of topProducts) {
      const unit = p.totalQuantity > 0 ? (p.totalRevenue / p.totalQuantity).toFixed(2) : "0";
      lines.push(csvRow(p.productName, `$${p.totalRevenue.toLocaleString("es-AR")}`, p.totalQuantity, `$${unit}`));
    }
    lines.push("");
    lines.push("CATÁLOGO (SELLER APP)");
    lines.push(csvRow("Total productos", sellerStats.totalProducts));
    lines.push(csvRow("En stock", sellerStats.inStock));
    lines.push(csvRow("Stock bajo", sellerStats.lowStock));
    lines.push(csvRow("Sin stock", sellerStats.outOfStock));
    lines.push("");
    lines.push("TOP PRODUCTOS SELLER");
    lines.push(csvRow("Producto", "Ingresos", "Stock"));
    for (const p of topSellerProducts) lines.push(csvRow(p.name, `$${p.revenue.toLocaleString("es-AR")}`, p.stock));
    lines.push("");
    lines.push("LOGÍSTICA (SHIPPING APP)");
    lines.push(csvRow("Total envíos", shippingStats.totalShipments));
    lines.push(csvRow("Entregados", shippingStats.delivered));
    lines.push(csvRow("En tránsito", shippingStats.inTransit));
    lines.push(csvRow("Fallidos", shippingStats.failed));
    lines.push(csvRow("Tasa de éxito", `${shippingStats.successRate}%`));
    lines.push(csvRow("Tiempo promedio", `${shippingStats.avgDeliveryDays} días`));
    lines.push("");
    lines.push("PAGOS (PAYMENTS APP)");
    lines.push(csvRow("Revenue total", `$${paymentStats.totalRevenue.toLocaleString("es-AR")}`));
    lines.push(csvRow("Pagos exitosos", paymentStats.successfulPayments));
    lines.push(csvRow("Pagos fallidos", paymentStats.failedPayments));
    lines.push(csvRow("Disputados", paymentStats.disputed));
    lines.push(csvRow("Ticket promedio", `$${paymentStats.avgTransactionValue.toLocaleString("es-AR")}`));
    lines.push(csvRow("Tasa de conversión", `${paymentStats.conversionRate}%`));
    lines.push("");
    lines.push("FAVORITOS");
    lines.push(csvRow("Total entradas", favourites.totalFavouriteEntries));
    lines.push(csvRow("Listas compartidas", favourites.totalSharedLists));
    lines.push("TOP PRODUCTOS FAVORITEADOS");
    lines.push(csvRow("Producto", "Usuarios"));
    for (const p of favourites.topFavouritedProducts) lines.push(csvRow(p.productName, p.userCount));
    lines.push("TOP CATEGORÍAS");
    lines.push(csvRow("Categoría", "Entradas"));
    for (const c of favourites.topCategories) lines.push(csvRow(c.category ?? c.name ?? "", c.count ?? c.total ?? 0));

    return new Response(lines.join("\r\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="infusio-analytics-${generatedOn.replace(/\//g, "-")}.csv"`,
      },
    });
  }

  // ─── PDF — Page 1: Overview ───────────────────────────────────────────────

  const page1 = React.createElement(Page, { size: "A4", orientation: "landscape", style: s.page },

    // Header
    React.createElement(View, { style: s.header },
      React.createElement(View, null,
        React.createElement(Text, { style: s.brand }, "INFUSIO"),
        React.createElement(Text, { style: s.brandSub }, "DASHBOARD ANALYTICS — REPORTE CONSOLIDADO")
      ),
      React.createElement(View, null,
        React.createElement(Text, { style: s.reportTitle }, "Resumen Ejecutivo"),
        React.createElement(Text, { style: s.reportDate }, `Generado el ${generatedOn}`)
      )
    ),

    HR(),

    // KPI tiles
    React.createElement(View, { style: s.kpiRow },
      React.createElement(View, { style: s.kpiBlock },
        React.createElement(Text, { style: s.kpiLabel }, "INGRESOS TOTALES"),
        React.createElement(Text, { style: s.kpiValue }, `$${overview.totalRevenue.toLocaleString("es-AR")}`),
        React.createElement(Text, { style: s.kpiSub }, `Ticket prom: $${avgOrder.toLocaleString("es-AR")}`)
      ),
      React.createElement(View, { style: s.kpiBlock },
        React.createElement(Text, { style: s.kpiLabel }, "PEDIDOS"),
        React.createElement(Text, { style: s.kpiValue }, String(overview.totalOrders)),
        React.createElement(Text, { style: s.kpiSub }, `Conf: ${overview.confirmedOrders} · Canc: ${overview.cancelledOrders} (${cancellationRate})`)
      ),
      React.createElement(View, { style: s.kpiBlock },
        React.createElement(Text, { style: s.kpiLabel }, "USUARIOS"),
        React.createElement(Text, { style: s.kpiValue }, String(overview.totalUsers)),
        React.createElement(Text, { style: s.kpiSub }, `Nuevos (30d): ${overview.newUsersLast30Days}`)
      ),
      React.createElement(View, { style: s.kpiBlock },
        React.createElement(Text, { style: s.kpiLabel }, "CARRITOS ABANDONADOS"),
        React.createElement(Text, { style: s.kpiValue }, String(overview.abandonedCarts)),
        React.createElement(Text, { style: s.kpiSub }, `Riesgo: $${overview.abandonedCartValue.toLocaleString("es-AR")} · ${abandonmentRate} usuarios`)
      ),
      React.createElement(View, { style: s.kpiBlock },
        React.createElement(Text, { style: s.kpiLabel }, "ENVÍOS"),
        React.createElement(Text, { style: s.kpiValue }, `${shippingStats.successRate}%`),
        React.createElement(Text, { style: s.kpiSub }, `Tasa de entrega · Prom: ${shippingStats.avgDeliveryDays} días`)
      ),
      React.createElement(View, { style: s.kpiBlock },
        React.createElement(Text, { style: s.kpiLabel }, "PAGOS"),
        React.createElement(Text, { style: s.kpiValue }, `${paymentStats.conversionRate}%`),
        React.createElement(Text, { style: s.kpiSub }, `Conv. · ${paymentStats.successfulPayments} exit. · ${paymentStats.failedPayments} fall.`)
      )
    ),

    HR_THIN(),

    // Two-column body
    React.createElement(View, { style: s.twoCol },

      // Left: monthly revenue
      React.createElement(View, { style: s.colLeft },
        SectionTitle("INGRESOS MENSUALES — ÚLTIMOS 12 MESES"),
        MiniTable(
          ["MES", "INGRESOS", "%"],
          revenueTimeSeries.monthly.map((m) => [
            m.month,
            `$${m.revenue.toLocaleString("es-AR")}`,
            pct(m.revenue, overview.totalRevenue),
          ])
        )
      ),

      // Right column: order status + shipping + payments
      React.createElement(View, { style: s.colRight },
        SectionTitle("DISTRIBUCIÓN DE PEDIDOS"),
        MiniTable(
          ["ESTADO", "CANT.", "%"],
          orderStatusDistribution.map((st) => [
            st.status,
            String(st.count),
            pct(st.count, overview.totalOrders),
          ]),
          [85, 40, 40]
        ),

        HR_THIN(),
        StatBlock("LOGÍSTICA", [
          ["Total envíos", String(shippingStats.totalShipments)],
          ["Entregados", String(shippingStats.delivered)],
          ["En tránsito", String(shippingStats.inTransit)],
          ["Fallidos", `${shippingStats.failed} (${pct(shippingStats.failed, shippingStats.totalShipments)})`],
          ["Tiempo promedio", `${shippingStats.avgDeliveryDays} días`],
        ]),

        StatBlock("PAGOS", [
          ["Revenue", `$${paymentStats.totalRevenue.toLocaleString("es-AR")}`],
          ["Exitosos", String(paymentStats.successfulPayments)],
          ["Fallidos", String(paymentStats.failedPayments)],
          ["Disputados", String(paymentStats.disputed)],
          ["Ticket promedio", `$${paymentStats.avgTransactionValue.toLocaleString("es-AR")}`],
        ])
      )
    ),

    // Footer
    React.createElement(View, { style: s.footer },
      React.createElement(Text, { style: s.footerText }, "INFUSIO — Reporte interno. No distribuir."),
      React.createElement(Text, { style: s.footerText }, `Página 1 de 2 · ${generatedOn}`)
    )
  );

  // ─── PDF — Page 2: Products & Catalog ────────────────────────────────────

  const page2 = React.createElement(Page, { size: "A4", orientation: "landscape", style: s.page },

    // Header
    React.createElement(View, { style: s.header },
      React.createElement(View, null,
        React.createElement(Text, { style: s.brand }, "INFUSIO"),
        React.createElement(Text, { style: s.brandSub }, "PRODUCTOS, CATÁLOGO Y COMPORTAMIENTO")
      ),
      React.createElement(View, null,
        React.createElement(Text, { style: s.reportTitle }, "Detalle de Productos"),
        React.createElement(Text, { style: s.reportDate }, `Generado el ${generatedOn}`)
      )
    ),

    HR(),

    // Top products buyer — full width table
    SectionTitle("TOP PRODUCTOS POR INGRESOS — BUYER APP"),
    React.createElement(View, { style: s.tableHead },
      React.createElement(Text, { style: { ...s.tableHeadCell, width: 20 } }, "#"),
      React.createElement(Text, { style: { ...s.tableHeadCell, flex: 1 } }, "PRODUCTO"),
      React.createElement(Text, { style: { ...s.tableHeadCell, width: 80, textAlign: "right" } }, "INGRESOS"),
      React.createElement(Text, { style: { ...s.tableHeadCell, width: 60, textAlign: "right" } }, "UNIDADES"),
      React.createElement(Text, { style: { ...s.tableHeadCell, width: 80, textAlign: "right" } }, "P. UNITARIO PROM."),
      React.createElement(Text, { style: { ...s.tableHeadCell, width: 60, textAlign: "right" } }, "% INGRESOS"),
    ),
    ...topProducts.slice(0, 10).map((p, idx) => {
      const unit = p.totalQuantity > 0 ? (p.totalRevenue / p.totalQuantity).toFixed(2) : "0";
      const rowStyle = idx % 2 === 0 ? s.tableRow : s.tableRowAlt;
      return React.createElement(View, { key: p.productName, style: rowStyle },
        React.createElement(Text, { style: { ...s.cellMuted, width: 20 } }, `${idx + 1}`),
        React.createElement(Text, { style: { ...s.cell, flex: 1 } }, p.productName),
        React.createElement(Text, { style: { ...s.cellRight, width: 80 } }, `$${p.totalRevenue.toLocaleString("es-AR")}`),
        React.createElement(Text, { style: { ...s.cellRight, width: 60 } }, String(p.totalQuantity)),
        React.createElement(Text, { style: { ...s.cellRightMuted, width: 80 } }, `$${unit}`),
        React.createElement(Text, { style: { ...s.cellRightMuted, width: 60 } }, pct(p.totalRevenue, overview.totalRevenue))
      );
    }),

    HR_THIN(),

    // Three-column section: seller products | favourites products | categories
    React.createElement(View, { style: { flexDirection: "row", gap: 16, marginTop: 4 } },

      // Seller top products
      React.createElement(View, { style: { flex: 1 } },
        SectionTitle("TOP PRODUCTOS — SELLER APP"),
        React.createElement(View, { style: s.tableHead },
          React.createElement(Text, { style: { ...s.tableHeadCell, flex: 1 } }, "PRODUCTO"),
          React.createElement(Text, { style: { ...s.tableHeadCell, width: 55, textAlign: "right" } }, "INGRESOS"),
          React.createElement(Text, { style: { ...s.tableHeadCell, width: 35, textAlign: "right" } }, "STOCK"),
        ),
        ...topSellerProducts.slice(0, 8).map((p, idx) =>
          React.createElement(View, { key: p.name, style: idx % 2 === 0 ? s.tableRow : s.tableRowAlt },
            React.createElement(Text, { style: { ...s.cell, flex: 1 } }, p.name),
            React.createElement(Text, { style: { ...s.cellRight, width: 55 } }, `$${p.revenue.toLocaleString("es-AR")}`),
            React.createElement(Text, { style: { ...s.cellRight, width: 35 } }, String(p.stock))
          )
        ),
        HR_THIN(),
        StatBlock("INVENTARIO", [
          ["Total productos", String(sellerStats.totalProducts)],
          ["En stock", String(sellerStats.inStock)],
          ["Stock bajo", String(sellerStats.lowStock)],
          ["Sin stock", String(sellerStats.outOfStock)],
          ["Categoría top", sellerStats.topCategory],
        ])
      ),

      // Favourited products
      React.createElement(View, { style: { width: 155 } },
        SectionTitle("MÁS FAVORITEADOS"),
        MiniTable(
          ["PRODUCTO", "USUARIOS"],
          favourites.topFavouritedProducts.slice(0, 8).map((p) => [
            p.productName,
            String(p.userCount),
          ]),
          [105, 40]
        ),
        HR_THIN(),
        SectionTitle("FAVORITOS POR CATEGORÍA"),
        MiniTable(
          ["CATEGORÍA", "ENTRADAS"],
          favourites.topCategories.slice(0, 6).map((c) => [
            String(c.category ?? c.name ?? ""),
            String(c.count ?? c.total ?? 0),
          ]),
          [95, 50]
        ),
        HR_THIN(),
        StatBlock("FAVORITOS", [
          ["Total entradas", String(favourites.totalFavouriteEntries)],
          ["Listas compartidas", String(favourites.totalSharedLists)],
        ])
      )
    ),

    // Footer
    React.createElement(View, { style: s.footer },
      React.createElement(Text, { style: s.footerText }, "INFUSIO — Reporte interno. No distribuir."),
      React.createElement(Text, { style: s.footerText }, `Página 2 de 2 · ${generatedOn}`)
    )
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  const doc = React.createElement(Document, null, page1, page2);
  const buffer = await renderToBuffer(doc);

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="infusio-analytics-${generatedOn.replace(/\//g, "-")}.pdf"`,
    },
  });
}
