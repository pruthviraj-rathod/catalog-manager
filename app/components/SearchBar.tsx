"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import useDebouncedValue from "../lib/hooks/useDebouncedValue";

export default function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const debouncedQ = useDebouncedValue(q, 300);

  useEffect(() => {
    const sp = new URLSearchParams(Object.fromEntries(params.entries()));
    if (debouncedQ) sp.set("q", debouncedQ);
    else sp.delete("q");
    router.replace(`${pathname}?${sp.toString()}`);
  }, [debouncedQ, params, router, pathname]);

  return (
    <input
      value={q}
      onChange={(e) => setQ(e.target.value)}
      placeholder="Search products..."
      className="input-class border border-black rounded-2xl px-4 py-3 w-full"
    />
  );
}
