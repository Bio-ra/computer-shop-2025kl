"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import products from "../../data/products.json"; // import pliku JSON

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function ProductListPage() {
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<"alphabetical" | "newest">(
    "alphabetical"
  );

  const shown = useMemo(() => {
    let list = [...products];
    if (onlyAvailable) {
      list = list.filter((p) => (p.amount ?? 0) > 0);
    }
    if (sortBy === "alphabetical") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // newest: sort by date descending
      list.sort((a, b) => {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        return db - da;
      });
    }
    return list;
  }, [onlyAvailable, sortBy]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.type));
    return Array.from(set);
  }, []);

  return (
    <div id="page">
      <div>
        <div className="mb-4">
          <div className="text-white mb-2">Kategorie:</div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/product-list/${slugify(cat)}`}
                className="bg-[#4f4fd0] text-white px-3 py-1 rounded hover:opacity-90"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex gap-3 items-center mb-4">
          <label className="text-white flex items-center gap-2">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded"
            />
            <span>Tylko dostępne</span>
          </label>

          <label className="text-white">
            Sortuj:
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="ml-2 rounded border px-2"
            >
              <option value="alphabetical">Alfabetycznie</option>
              <option value="newest">Najnowsze</option>
            </select>
          </label>
        </div>

        <div
          className="grid gap-4 mt-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          {shown.map((product) => (
            <div
              key={product.id}
              className="bg-[#7f7fe0] p-4 rounded-lg shadow-md"
            >
              <h3 className="text-white text-lg mb-2">
                <Link
                  href={`/product-list/${product.id}`}
                  className="text-white hover:underline"
                >
                  {product.name}
                </Link>
              </h3>
              <p className="text-[#e5e5e1] text-sm">Typ: {product.type}</p>
              <p className="text-[#e5e5e1] text-sm">Cena: {product.price} zł</p>
              <p className="text-[#e5e5e1] text-sm">Ilość: {product.amount}</p>
              <p className="text-[#e5e5e1] text-sm">
                Data dodania: {product.date}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
