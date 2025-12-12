import products from "../../../../data/products.json";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ [key: string]: string }> | { [key: string]: string };
};

export default async function ProductImagePage({ params }: Props) {
  const resolvedParams = (await params) as { [key: string]: string };
  const idStr =
    resolvedParams["product-id"] ??
    resolvedParams.productId ??
    Object.values(resolvedParams)[0];

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
      <a
        href={`/product-list/${product.id}`}
        className="text-white underline mr-3"
      >
        Powrót
      </a>
      <div className="mt-4">
        {imgSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={product.name}
            className="max-w-full rounded-lg"
          />
        )}
      </div>
    </div>
  );
}
