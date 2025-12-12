import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Historia Zakupów - Sklep Komputerowy 2025KL",
  description: "Historia zamówień sklepu komputerowego",
};

export default function Layout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div>
      {children}
    </div>
  );
}
