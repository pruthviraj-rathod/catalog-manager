"use client";
import Link from "next/link";
import React from "react";
import { Product } from "../../types/product";

export default function ProductCard({ product }: { product: Product }) {
  console.log("product----", product);
  const finalPrice = (product.sellPrice * (1 - product.discount / 100)).toFixed(
    2
  );
  return (
    <div className="border rounded p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.category}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">
            Cost: ₹{product.costPrice}
          </div>
          <div className="text-sm">Sell: ₹{product.sellPrice}</div>
          <div className="text-sm text-green-600">Final: ₹{finalPrice}</div>
        </div>
      </div>
      {product.description && (
        <p className="mt-2 text-sm text-gray-700">{product.description}</p>
      )}
      <div className="mt-3 flex gap-2">
        <Link
          href={`/products/edit/${product.id}`}
          className="text-sm text-blue-600"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
