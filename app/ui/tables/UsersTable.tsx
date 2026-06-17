"use client";

import React from "react";
import PaginatedTable from "./PaginatedTable";

interface FavouritedProduct {
  productName?: string;
  name?: string;
  count?: number;
  total?: number;
}

interface FavouritedCategory {
  category?: string;
  name?: string;
  count?: number;
  total?: number;
}

interface TopFavouritedProductsTableProps {
  data: FavouritedProduct[];
  pageSize?: number;
}

interface TopCategoriesTableProps {
  data: FavouritedCategory[];
  pageSize?: number;
}

export function TopFavouritedProductsTable({
  data,
  pageSize = 5,
}: TopFavouritedProductsTableProps) {
  const columns = [
    {
      header: "Producto",
      render: (item: FavouritedProduct) => (
        <span className="text-brown font-medium">{item.productName ?? item.name}</span>
      ),
      className: "text-left",
    },
    {
      header: "Veces favoriteado",
      render: (item: FavouritedProduct) => (
        <span className="inline-flex items-center gap-1 text-terracotta font-medium">
          ♥ {item.count ?? item.total}
        </span>
      ),
      className: "text-right",
    },
  ];

  return <PaginatedTable data={data} columns={columns} pageSize={pageSize} />;
}

export function TopCategoriesTable({ data, pageSize = 5 }: TopCategoriesTableProps) {
  const columns = [
    {
      header: "Categoría",
      render: (item: FavouritedCategory) => (
        <span className="text-brown font-medium capitalize">{item.category ?? item.name}</span>
      ),
      className: "text-left",
    },
    {
      header: "Entradas",
      render: (item: FavouritedCategory) => (
        <span className="text-muted-foreground">{item.count ?? item.total}</span>
      ),
      className: "text-right",
    },
  ];

  return <PaginatedTable data={data} columns={columns} pageSize={pageSize} />;
}
