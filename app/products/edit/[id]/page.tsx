import React from "react";
import ProductForm from "../../../components/ProductForm";

export default async function Page({
  params,
}: { params?: { id?: string } | Promise<{ id?: string }> } = {}) {
  const resolvedParams = params ? await params : undefined;
  const id = resolvedParams?.id;
  console.log("id---", id);
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

  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  console.log("basebasebase-", base);
  const res = await fetch(`${base}/api/products/${id}`);
  console.log("resresres-", res);
  let product = null;
  if (res.ok) {
    product = await res.json();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit product</h1>
      <ProductForm initial={product} />
    </div>
  );
}
