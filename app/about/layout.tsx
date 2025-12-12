import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O Sklepie - Sklep Komputerowy 2025KL",
  description: "Informacje o sklepie komputerowym",
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
