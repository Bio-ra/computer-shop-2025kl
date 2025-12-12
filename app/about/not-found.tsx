import Link from "next/link";

export default function AboutNotFound() {
  return (
    <main className="not-found">
      <h1>Nie znaleziono strony - About</h1>
      <p>Nie znaleziono strony w sekcji "O nas".</p>
      <p>Sprawdź ścieżkę lub wróć do strony głównej.</p>
      <p>
        <Link href="/about">Powrót do sekcji O nas</Link>
      </p>
    </main>
  );
}
