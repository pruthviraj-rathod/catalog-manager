import { NextResponse } from "next/server";
import { Product } from "../../../../types/product";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "../../../../lib/store";

export async function GET(
  _req: Request,
  { params }: { params?: { id?: string } | Promise<{ id?: string }> } = {}
) {
  const resolvedParams = params ? await params : undefined;
  const id = resolvedParams?.id;
  const found = await getProductById(id || "");
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
  const updated = await updateProduct(id || "", body);
  if (!updated)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params?: { id?: string } | Promise<{ id?: string }> } = {}
) {
  const resolvedParams = params ? await params : undefined;
  const id = resolvedParams?.id;
  const deleted = await deleteProduct(id || "");
  if (!deleted)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ message: "deleted" });
}
