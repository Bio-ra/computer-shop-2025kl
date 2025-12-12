import type { Metadata } from "next";
import "./global.css";
import MainHeader from "@/components/main-header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Sklep Komputerowy 2025KL",
  description: "Sklep Komputerowy stworzony przez Kamila Lenczyka",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        <MainHeader />
        <main id="page">{children}</main>
        <Footer />
      </body>
    </html>
  );
}