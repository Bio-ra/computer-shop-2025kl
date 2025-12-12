import Discounts from "./discounts/Discounts";

export default function ProductListLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  return (
    <section>
      <h2>Lista produktów</h2>
      {/* Promocje - wyświetlane niezależnie od listy produktów/kategorii */}
      <Discounts />
      {children}
      {/* render modal parallel route slot when present */}
      {modal}
    </section>
  );
}
