import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koszyk - Sklep Komputerowy 2025KL",
  description: "Koszyk zakupowy sklepu komputerowego",
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
