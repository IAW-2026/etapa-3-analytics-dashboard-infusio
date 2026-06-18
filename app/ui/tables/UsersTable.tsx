"use client";

import React from "react";
import PaginatedTable from "./PaginatedTable";

interface FavouritedProduct {
  productName: string;
  userCount: number;
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
        <span className="text-brown font-medium">{item.productName}</span>
      ),
      className: "text-left",
    },
    {
      header: "Veces favoriteado",
      render: (item: FavouritedProduct) => {
        const n = item.userCount;
        return (
          <span className="inline-flex items-center gap-px text-terracotta font-medium justify-center">
            {n > 5 ? (
              <><span>♥</span><span className="ml-1 text-xs">{n}</span></>
            ) : (
              Array.from({ length: n }, (_, i) => <span key={i}>♥</span>)
            )}
          </span>
        );
      },
      className: "text-center",
    },
  ];

  return <PaginatedTable data={data} columns={columns} pageSize={pageSize} />;
}

export function TopCategoriesTable({ data, pageSize = 10 }: TopCategoriesTableProps) {
  const columns = [
    {
      header: "Categoría",
      render: (item: FavouritedCategory) => (
        <span className="text-brown font-medium capitalize">{item.category ?? item.name}</span>
      ),
      className: "text-center",
    },
    {
      header: "Entradas",
      render: (item: FavouritedCategory) => (
        <span className="text-muted-foreground">{item.count ?? item.total}</span>
      ),
      className: "text-center",
    },
  ];

  return <PaginatedTable data={data} columns={columns} pageSize={pageSize} />;
}
