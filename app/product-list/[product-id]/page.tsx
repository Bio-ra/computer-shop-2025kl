import products from "../../../data/products.json";
import ClientProductImage from "../../../components/ProductImage";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ [key: string]: string }> | { [key: string]: string };
};

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = (await params) as { [key: string]: string };
  const idStr =
    resolvedParams["product-id"] ??
    resolvedParams.productId ??
    Object.values(resolvedParams)[0];

  // if idStr is a number -> render product page
  if (!Number.isNaN(Number(idStr))) {
    const id = Number(idStr);
    const product = products.find((p) => Number(p.id) === id);

    if (!product) {
      notFound();
    }

    const imgSrc = product.image
      ? product.image.replace(/^public/, "")
      : undefined;

    return (
      <div className="p-4">
        <div className="bg-[#7f7fe0] p-4 rounded-lg shadow-md">
          <h2 className="text-white text-2xl">{product.name}</h2>
          {imgSrc && (
            <div className="my-3">
              <ClientProductImage
                id={product.id}
                src={imgSrc}
                alt={product.name}
              />
            </div>
          )}

          <p className="text-[#e5e5e1]">Typ: {product.type}</p>
          <p className="text-[#e5e5e1]">Kod: {product.code}</p>
          <p className="text-[#e5e5e1]">Cena: {product.price} zł</p>
          <p className="text-[#e5e5e1]">Ilość: {product.amount}</p>
          <p className="text-[#e5e5e1]">Data dodania: {product.date}</p>
          <h3 className="text-white mt-3">Opis</h3>
          <p className="text-[#e5e5e1]">{product.description}</p>
        </div>
      </div>
    );
  }

  // otherwise treat idStr as category slug
  const categorySlug = idStr;
  const items = products.filter((p) => slugify(p.type) === categorySlug);
  if (items.length === 0) {
    notFound();
  }

  const categoryName = items[0].type;
  return (
    <div className="p-4">
      <div className="mb-4">
        <a href="/product-list" className="text-white underline mr-3">
          Powrót
        </a>
        <h2 className="inline text-white text-2xl">
          Kategoria: {categoryName}
        </h2>
      </div>

      <div
        className="grid gap-4 mt-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
      >
        {items.map((product) => (
          <div
            key={product.id}
            className="bg-[#7f7fe0] p-4 rounded-lg shadow-md"
          >
            <h3 className="text-white text-lg mb-2">
              <a
                href={`/product-list/${categorySlug}/${product.id}`}
                className="text-white hover:underline"
              >
                {product.name}
              </a>
            </h3>
            <p className="text-[#e5e5e1] text-sm">Typ: {product.type}</p>
            <p className="text-[#e5e5e1] text-sm">Cena: {product.price} zł</p>
            <p className="text-[#e5e5e1] text-sm">Ilość: {product.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
