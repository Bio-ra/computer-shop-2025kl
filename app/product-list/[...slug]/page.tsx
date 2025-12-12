import Link from "next/link";
import products from "../../../data/products.json";
import ClientProductImage from "../../../components/ProductImage";
import { notFound } from "next/navigation";

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

type Props = { params: Promise<{ slug?: string[] }> | { slug?: string[] } };

export default async function CategoryOrProductPage({ params }: Props) {
  const resolvedParams = (await params) as { slug?: string[] };
  const slug = resolvedParams?.slug;

  // no slug -> show all products (fallback to main view)
  if (!slug || slug.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-white text-2xl mb-3">Wszystkie produkty</h2>
        <div
          className="grid gap-4 mt-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#7f7fe0] p-4 rounded-lg shadow-md"
            >
              <h3 className="text-white text-lg mb-2">
                <Link
                  href={`/product-list/${slugify(product.type)}/${product.id}`}
                  className="text-white hover:underline"
                >
                  {product.name}
                </Link>
              </h3>
              <p className="text-[#e5e5e1] text-sm">Typ: {product.type}</p>
              <p className="text-[#e5e5e1] text-sm">Cena: {product.price} zł</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // if single slug and numeric -> direct product page
  if (slug.length === 1 && !Number.isNaN(Number(slug[0]))) {
    const id = Number(slug[0]);
    const product = products.find((p) => Number(p.id) === id);
    if (!product) notFound();

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

  // single slug non-numeric -> category view
  if (slug.length === 1) {
    const categorySlug = slug[0];
    const items = products.filter((p) => slugify(p.type) === categorySlug);
    if (items.length === 0) {
      notFound();
    }
    // show category products
    const categoryName = items[0].type;
    return (
      <div className="p-4">
        <div className="mb-4">
          <Link href="/product-list" className="text-white underline mr-3">
            Powrót
          </Link>
          <h2 className="inline text-white text-2xl">
            Kategoria: {categoryName}
          </h2>
        </div>

        <div
          className="grid gap-4 mt-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          {items.map((product) => (
            <div
              key={product.id}
              className="bg-[#7f7fe0] p-4 rounded-lg shadow-md"
            >
              <h3 className="text-white text-lg mb-2">
                <Link
                  href={`/product-list/${categorySlug}/${product.id}`}
                  className="text-white hover:underline"
                >
                  {product.name}
                </Link>
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

  // two or more segments -> treat last as product id
  if (slug.length >= 2) {
    const productIdStr = slug[slug.length - 1];
    const id = Number(productIdStr);
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

  notFound();
}
