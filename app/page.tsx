import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-3">Catalog Manager</h1>
      <div className="flex gap-3">
        <Link
          href="/products"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          View Products
        </Link>
        <Link href="/products/edit/new" className="px-4 py-2 border rounded">
          Add Product
        </Link>
      </div>
      <div></div>
    </div>
  );
}
