import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>Nie znaleziono strony produktów</h1>
      <p>
        Podstrona produktów nie istnieje. Wróć do{" "}
        <Link href="/">listy produktów.</Link>
      </p>
    </main>
  );
}
