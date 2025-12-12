import { NextResponse } from "next/server";
import { Product } from "../../../../types/product";

let productsStore: Product[] = [];

export async function GET(
  _req: Request,
  { params }: { params?: { id?: string } | Promise<{ id?: string }> } = {}
) {
  const resolvedParams = params ? await params : undefined;
  const id = resolvedParams?.id;
  const found = productsStore.find((p) => p.id === id);
  if (!found)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(found);
}

export async function PUT(
  request: Request,
  { params }: { params?: { id?: string } | Promise<{ id?: string }> } = {}
) {
  const resolvedParams = params ? await params : undefined;
  const id = resolvedParams?.id;
  const body = await request.json();
  const idx = productsStore.findIndex((p) => p.id === id);
  if (idx === -1)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  const updated = {
    ...productsStore[idx],
    ...body,
    updatedAt: new Date().toISOString(),
  };
  productsStore[idx] = updated;
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params?: { id?: string } | Promise<{ id?: string }> } = {}
) {
  const resolvedParams = params ? await params : undefined;
  const id = resolvedParams?.id;
  const idx = productsStore.findIndex((p) => p.id === id);
  if (idx === -1)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  productsStore.splice(idx, 1);
  return NextResponse.json({ message: "deleted" });
}
