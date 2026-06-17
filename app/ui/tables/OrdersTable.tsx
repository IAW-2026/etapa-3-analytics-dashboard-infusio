"use client";

import React from "react";
import PaginatedTable from "./PaginatedTable";

interface TopProduct {
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}

interface OrdersTableProps {
  data: TopProduct[];
  pageSize?: number;
}

export default function OrdersTable({ data, pageSize = 8 }: OrdersTableProps) {
  const columns = [
    {
      header: "#",
      render: (_: TopProduct, index: number) => (
        <span className="text-xs text-muted-foreground font-mono">#{index + 1}</span>
      ),
      className: "text-left w-12",
    },
    {
      header: "Producto",
      render: (item: TopProduct) => (
        <span className="text-brown font-medium">{item.productName}</span>
      ),
      className: "text-left",
    },
    {
      header: "Unidades vendidas",
      render: (item: TopProduct) => (
        <span>{item.totalQuantity.toLocaleString("es-AR")}</span>
      ),
      className: "text-right",
    },
    {
      header: "Ingresos generados",
      render: (item: TopProduct) => (
        <span className="font-medium text-brown">
          ${item.totalRevenue.toLocaleString("es-AR")}
        </span>
      ),
      className: "text-right",
    },
    {
      header: "Precio unitario prom.",
      render: (item: TopProduct) => {
        const unitPrice = item.totalQuantity > 0 ? item.totalRevenue / item.totalQuantity : 0;
        return (
          <span className="text-muted-foreground">
            ${unitPrice.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        );
      },
      className: "text-right hidden md:table-cell",
    },
  ];

  return <PaginatedTable data={data} columns={columns} pageSize={pageSize} />;
}
