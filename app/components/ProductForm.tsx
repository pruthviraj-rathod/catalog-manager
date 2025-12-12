"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "../../types/product";

type Props = {
  initial?: Product | null;
  onSuccess?: () => void;
};

export default function ProductForm({ initial, onSuccess }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [expiryDate, setExpiryDate] = useState(initial?.expiryDate ?? "");
  const [costPrice, setCostPrice] = useState(initial?.costPrice ?? null);
  const [sellPrice, setSellPrice] = useState(initial?.sellPrice ?? null);
  const [discount, setDiscount] = useState(initial?.discount ?? null);
  const [loading, setLoading] = useState(false);
  const id = initial?.id;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name,
      category,
      description,
      expiryDate: expiryDate || null,
      costPrice: Number(costPrice),
      sellPrice: Number(sellPrice),
      discount: Number(discount),
    };

    try {
      if (id) {
        await fetch(`/api/products/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`/api/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      onSuccess?.();
      router.replace("/products");
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Category</label>
        <select
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded border px-3 py-2"
        >
          <option value="">Select category</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="fashion">Fashion</option>
          <option value="grocery">Grocery</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Expiry date</label>
        <input
          type="date"
          value={expiryDate ?? ""}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Cost price</label>
          <input
            required
            type="number"
            step="0.01"
            value={costPrice}
            onChange={(e) => setCostPrice(Number(e.target.value))}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Sell price</label>
          <input
            required
            type="number"
            step="0.01"
            value={sellPrice}
            onChange={(e) => setSellPrice(Number(e.target.value))}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Discount %</label>
          <input
            type="number"
            step="0.01"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 bg-blue-600 text-white rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : id ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
