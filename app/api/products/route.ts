import { NextResponse } from "next/server";
import { Product } from "../../../types/product";
import {
  getAllProducts,
  addProduct,
} from "../../../lib/store";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").toLowerCase();
  const products = await getAllProducts();
  if (!q) return NextResponse.json(products);
  const filtered = products.filter((p) =>
    [p.name, p.category, p.description || ""]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newProduct: Product = {
    id: crypto.randomUUID(),
    name: body.name,
    category: body.category,
    description: body.description ?? null,
    expiryDate: body.expiryDate ?? null,
    costPrice: Number(body.costPrice) || 0,
    sellPrice: Number(body.sellPrice) || 0,
    discount: Number(body.discount) || 0,
    createdAt: new Date().toISOString(),
  };
  await addProduct(newProduct);
  return NextResponse.json(newProduct, { status: 201 });
}
