"use client";

import React from "react";
import PaginatedTable from "./PaginatedTable";

interface Product {
  id: string | number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  revenue: number;
}

interface ProductsTableProps {
  data: Product[];
  pageSize?: number;
}

const STOCK_STYLES: Record<string, string> = {
  ok: "bg-olive/10 text-olive",
  low: "bg-yellow-50 text-yellow-700",
  out: "bg-red-50 text-red-700",
};

function stockStatus(stock: number) {
  if (stock === 0) return { label: "Sin stock", style: STOCK_STYLES.out };
  if (stock <= 10) return { label: `Bajo (${stock})`, style: STOCK_STYLES.low };
  return { label: `En stock (${stock})`, style: STOCK_STYLES.ok };
}

export default function ProductsTable({ data, pageSize = 8 }: ProductsTableProps) {
  const columns = [
    {
      header: "Producto",
      render: (item: Product) => (
        <span className="text-brown font-medium">{item.name}</span>
      ),
      className: "text-left",
    },
    {
      header: "Categoría",
      render: (item: Product) => (
        <span className="text-muted-foreground capitalize">{item.category}</span>
      ),
      className: "text-left hidden md:table-cell",
    },
    {
      header: "Precio",
      render: (item: Product) => (
        <span>${item.price.toFixed(2)}</span>
      ),
      className: "text-right",
    },
    {
      header: "Stock",
      render: (item: Product) => {
        const { label, style } = stockStatus(item.stock);
        return (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style}`}>
            {label}
          </span>
        );
      },
      className: "text-left hidden lg:table-cell",
    },
    {
      header: "Rating",
      render: (item: Product) => (
        <span className="text-muted-foreground">
          {"★".repeat(Math.round(item.rating))} {item.rating.toFixed(1)}
        </span>
      ),
      className: "text-right hidden lg:table-cell",
    },
    {
      header: "Ingresos",
      render: (item: Product) => (
        <span className="font-medium text-brown">
          ${item.revenue.toLocaleString("es-AR")}
        </span>
      ),
      className: "text-right",
    },
  ];

  return <PaginatedTable data={data} columns={columns} pageSize={pageSize} />;
}
