import Link from "next/link";
import React from "react";
import ProductsList from "../components/ProductsList";

export default function Page() {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/products/edit/new"
          className="px-3 py-2 bg-green-600 text-white rounded"
        >
          New Product
        </Link>
      </div>
      <ProductsList />
    </div>
  );
}
