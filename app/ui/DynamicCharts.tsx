"use client";

import dynamic from "next/dynamic";

function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-tan p-6 shadow-sm">
      <div className="h-4 w-32 bg-muted rounded mb-2 animate-pulse" />
      <div className="h-3 w-20 bg-muted/50 rounded mb-6 animate-pulse" />
      <div className="h-52 w-full bg-muted/30 rounded-xl animate-pulse" />
    </div>
  );
}

export const DynamicRevenueAreaChart = dynamic(
  () => import("@/app/ui/charts/RevenueAreaChart"),
  { ssr: false, loading: ChartSkeleton }
);

export const DynamicOrderStatusPieChart = dynamic(
  () => import("@/app/ui/charts/OrderStatusPieChart"),
  { ssr: false, loading: ChartSkeleton }
);

export const DynamicUserGrowthChart = dynamic(
  () => import("@/app/ui/charts/UserGrowthChart"),
  { ssr: false, loading: ChartSkeleton }
);

export const DynamicTopProductsChart = dynamic(
  () => import("@/app/ui/charts/TopProductsChart"),
  { ssr: false, loading: ChartSkeleton }
);

export const DynamicShippingStatusChart = dynamic(
  () => import("@/app/ui/charts/ShippingStatusChart"),
  { ssr: false, loading: ChartSkeleton }
);

export const DynamicPaymentMethodsChart = dynamic(
  () => import("@/app/ui/charts/PaymentMethodsChart"),
  { ssr: false, loading: ChartSkeleton }
);

export const DynamicWeeklyVolumeChart = dynamic(
  () => import("@/app/ui/charts/WeeklyVolumeChart"),
  { ssr: false, loading: ChartSkeleton }
);

export const DynamicDisputesTrendChart = dynamic(
  () => import("@/app/ui/charts/DisputesTrendChart"),
  { ssr: false, loading: ChartSkeleton }
);

export const DynamicDeliveryTimeChart = dynamic(
  () => import("@/app/ui/charts/DeliveryTimeChart"),
  { ssr: false, loading: ChartSkeleton }
);

export const DynamicCategoryRevenueChart = dynamic(
  () => import("@/app/ui/charts/CategoryRevenueChart"),
  { ssr: false, loading: ChartSkeleton }
);
