import { NextResponse } from "next/server";
import { Product } from "../../../types/product";

let products: Product[] = [
  {
    id: "1",
    name: "Sample Phone",
    category: "electronics",
    description: "A sample phone",
    expiryDate: null,
    costPrice: 10000,
    sellPrice: 12000,
    discount: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Notebook",
    category: "books",
    description: "A ruled notebook",
    expiryDate: null,
    costPrice: 50,
    sellPrice: 80,
    discount: 0,
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").toLowerCase();
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
  products.unshift(newProduct);
  return NextResponse.json(newProduct, { status: 201 });
}
