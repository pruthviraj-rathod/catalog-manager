"use client";
import React, { useEffect, useState } from "react";
import ProductForm from "../../../components/ProductForm";
import { Loader } from "../../../components/Loader";
import { Product } from "../../../../types/product";

export default function Page({
  params,
}: {
  params?: { id?: string } | Promise<{ id?: string }>;
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = params ? await params : undefined;
      const productId = resolvedParams?.id;
      setId(productId || null);

      if (!productId || productId === "new") {
        setLoading(false);
        return;
      }

      try {
        // Try to get from localStorage first
        const stored = localStorage.getItem("products");
        if (stored) {
          const products = JSON.parse(stored);
          const found = products.find((p: Product) => p.id === productId);
          if (found) {
            setProduct(found);
            setLoading(false);
            return;
          }
        }

        // Fallback to API
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadParams();
  }, [params]);

  if (loading) {
    return (
      <div className="p-6">
        <Loader />
      </div>
    );
  }

  if (id === "new") {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Create product</h1>
        <ProductForm />
      </div>
    );
  }

  if (!id) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Product</h1>
        <p>Missing product id</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit product</h1>
      <ProductForm initial={product} />
    </div>
  );
}
