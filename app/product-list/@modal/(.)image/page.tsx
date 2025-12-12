import products from "../../../../data/products.json";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ "product-id"?: string }> | { "product-id"?: string };
};

export default async function ModalImagePage({ params }: Props) {
  // This file is a placeholder for the modal parallel route's content.
  // In this project we open the modal on the client side and update history,
  // so this server page is not used directly, but it's present to satisfy
  // the requested folder structure.
  const resolved = (await params) as { "product-id"?: string };
  const idStr = resolved["product-id"] ?? Object.values(resolved)[0];
  const id = Number(idStr);
  const product = products.find((p) => Number(p.id) === id);
  if (!product) notFound();

  const imgSrc = product.image
    ? product.image.replace(/^public/, "")
    : undefined;

  return (
    <div className="p-4">
      <h3 className="text-white">Obraz (modal) - {product.name}</h3>
      {imgSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgSrc}
          alt={product.name}
          className="max-w-full rounded-lg mt-3"
        />
      )}
    </div>
  );
}
