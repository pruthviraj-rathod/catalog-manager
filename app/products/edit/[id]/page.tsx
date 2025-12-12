import React from "react";
import ProductForm from "../../../components/ProductForm";
import { getProductById } from "../../../../lib/store";

export default async function Page({
  params,
}: { params?: { id?: string } | Promise<{ id?: string }> } = {}) {
  const resolvedParams = params ? await params : undefined;
  const id = resolvedParams?.id;

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

  let product = null;
  try {
    product = await getProductById(id);
  } catch (error) {
    console.error("Failed to fetch product:", error);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit product</h1>
      <ProductForm initial={product} />
    </div>
  );
}
