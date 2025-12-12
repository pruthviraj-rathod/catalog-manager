"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Navbar() {
  const path = usePathname() || "/";

  const isActive = (p: string) =>
    p === "/" ? path === "/" : path.startsWith(p);

  return (
    <nav className="w-full bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-lg font-semibold">
              Catalog Manager
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/products"
                className={`px-2 py-1 rounded text-sm ${
                  isActive("/products") ? "bg-gray-100" : "text-gray-600"
                }`}
              >
                Products
              </Link>
              <Link
                href="/products/edit/new"
                className={`px-2 py-1 rounded text-sm ${
                  isActive("/products/edit") ? "bg-gray-100" : "text-gray-600"
                }`}
              >
                New
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded"
            >
              View Products
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
