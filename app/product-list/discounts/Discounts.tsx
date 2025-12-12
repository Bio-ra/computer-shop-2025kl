import Link from "next/link";
import products from "../../../data/products.json";

export default function Discounts() {
  // pick 3 random unique products
  const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, 3);

  return (
    <div className="mb-6">
      <h3 className="text-white text-xl mb-2 text-center">Promocje</h3>
      <div className="flex gap-4 overflow-x-auto justify-center px-4">
        {shuffled.map((p) => {
          const orig = Number(p.price);
          const discounted = Number((orig * 0.9).toFixed(2));
          return (
            <div
              key={p.id}
              className="bg-[#6b6be8] p-3 rounded w-64 flex-shrink-0"
            >
              <h4 className="text-white font-semibold">
                <Link
                  href={`/product-list/${p.id}`}
                  className="hover:underline"
                >
                  {p.name}
                </Link>
              </h4>
              <p className="text-[#e5e5e1] text-sm">Typ: {p.type}</p>
              <div className="mt-2">
                <span className="text-[#e5e5e1] line-through mr-2">
                  {orig} zł
                </span>
                <span className="text-white font-bold">{discounted} zł</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
