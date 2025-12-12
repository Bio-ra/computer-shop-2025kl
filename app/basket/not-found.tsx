import Link from "next/link";

export default function BasketNotFound() {
  return (
    <main className="not-found">
      <h1>Nie znaleziono strony - Koszyk</h1>
      <p>Nie znaleziono strony w sekcji "Koszyk".</p>
      <p>Sprawdź ścieżkę lub wróć do strony głównej.</p>
      <p>
        <Link href="/basket">Powrót do Koszyka</Link>
      </p>
    </main>
  );
}
