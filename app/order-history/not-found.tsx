import Link from "next/link";

export default function OrderHistoryNotFound() {
  return (
    <main className="not-found">
      <h1>Nie znaleziono strony - Historia zamówień</h1>
      <p>Nie znaleziono strony w sekcji "Historia zamówień".</p>
      <p>Sprawdź ścieżkę lub wróć do strony głównej.</p>
      <p>
        <Link href="/order-history">Powrót do Historii zamówień</Link>
      </p>
    </main>
  );
}
