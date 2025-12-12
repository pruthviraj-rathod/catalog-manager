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

  const totalCostPrice = products.reduce((sum, p) => sum + p.costPrice, 0);
  const totalSellPrice = products.reduce((sum, p) => sum + p.sellPrice, 0);
  const totalFinalPrice = totalSellPrice - totalCostPrice;

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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => selectAllOnPage(e.target.checked)}
                      checked={paginated.length > 0 && paginated.every((p) => selected.includes(p.id))}
                    />
                  </th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-right">Cost Price</th>
                  <th className="px-4 py-3 text-right">Sell Price</th>
                  <th className="px-4 py-3 text-right">Discount %</th>
                  <th className="px-4 py-3 text-left">Expiry Date</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(p.id)}
                        onChange={(e) => toggleSelect(p.id)}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3">{p.category}</td>
                    <td className="px-4 py-3 text-sm">{p.description || "-"}</td>
                    <td className="px-4 py-3 text-right">₹{p.costPrice}</td>
                    <td className="px-4 py-3 text-right">₹{p.sellPrice}</td>
                    <td className="px-4 py-3 text-right">{p.discount}%</td>
                    <td className="px-4 py-3 text-sm">{p.expiryDate || "-"}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`/products/edit/${p.id}`}
                        className="text-blue-600 hover:underline text-sm mr-3"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingIds.includes(p.id)}
                        className="text-red-600 hover:underline text-sm disabled:opacity-50"
                      >
                        {deletingIds.includes(p.id) ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-200 font-bold">
                  <td colSpan={4} className="px-4 py-3 text-right">
                    TOTAL:
                  </td>
                  <td className="px-4 py-3 text-right">₹{totalCostPrice}</td>
                  <td className="px-4 py-3 text-right">₹{totalSellPrice}</td>
                  <td className="px-4 py-3 text-right">₹{totalFinalPrice}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <label className="inline-flex items-center gap-2">
                <span className="text-sm">Page</span>
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
                {page} / {totalPages}
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
