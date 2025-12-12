"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { Product } from "../../types/product";
import SearchBar from "./SearchBar";

export default function ProductsList() {
  const params = useSearchParams();
  const q = params?.get("q") ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`/api/products${q ? `?q=${encodeURIComponent(q)}` : ""}`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        if (mounted) setProducts(data);
      })
      .catch((err) => console.error(err))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [q]);

  useEffect(() => {
    setPage(1);
    setSelected([]);
  }, [q, products.length]);

  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const startIdx = (page - 1) * PAGE_SIZE;
  const paginated = products.slice(startIdx, startIdx + PAGE_SIZE);

  function toggleSelect(id: string) {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  }

  function selectAllOnPage(checked: boolean) {
    if (checked) {
      const ids = paginated.map((p) => p.id);
      setSelected((s) => Array.from(new Set([...s, ...ids])));
    } else {
      const ids = new Set(paginated.map((p) => p.id));
      setSelected((s) => s.filter((id) => !ids.has(id)));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    setDeletingIds((d) => [...d, id]);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((p) => p.filter((x) => x.id !== id));
        setSelected((s) => s.filter((x) => x !== id));
      } else {
        console.error("delete failed", await res.text());
        alert("Failed to delete");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    } finally {
      setDeletingIds((d) => d.filter((x) => x !== id));
    }
  }

  async function handleBulkDelete() {
    if (selected.length === 0) return alert("No items selected");
    if (!confirm(`Delete ${selected.length} selected products?`)) return;
    // delete in parallel
    const toDelete = [...selected];
    setDeletingIds(toDelete);
    try {
      await Promise.all(
        toDelete.map((id) => fetch(`/api/products/${id}`, { method: "DELETE" }))
      );
      setProducts((p) => p.filter((x) => !toDelete.includes(x.id)));
      setSelected([]);
    } catch (err) {
      console.error(err);
      alert("Bulk delete failed");
    } finally {
      setDeletingIds([]);
    }
  }

  return (
    <div>
      <div className="mb-4">
        <SearchBar />
      </div>

      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">Total items: {total}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleBulkDelete}
            disabled={selected.length === 0}
            className="px-2 py-1 bg-red-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete selected
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : products.length === 0 ? (
        <div>No products found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginated.map((p) => (
              <div key={p.id} className="flex gap-3 items-start">
                <input
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  onChange={(e) => toggleSelect(p.id)}
                  className="mt-2"
                />
                <div className="flex-1">
                  <ProductCard product={p} />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingIds.includes(p.id)}
                      className="text-sm text-red-600"
                    >
                      {deletingIds.includes(p.id) ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  onChange={(e) => selectAllOnPage(e.target.checked)}
                  checked={paginated.every((p) => selected.includes(p.id))}
                />
                <span className="text-sm">Select all on page</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((s) => Math.max(1, s - 1))}
                disabled={page === 1}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <div className="text-sm">
                Page {page} / {totalPages}
              </div>
              <button
                onClick={() => setPage((s) => Math.min(totalPages, s + 1))}
                disabled={page === totalPages}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
