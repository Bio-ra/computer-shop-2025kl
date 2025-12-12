import Image from "next/image";

export default function Home() {
  return (
    <div>
      <main id="home" className="p-8 text-center">
        <Image
          className="w-[100px] h-[100px] mx-auto"
          src="/politechnika-krakowska-logo.svg"
          alt="Logo Politechniki Krakowskiej"
          width={100}
          height={100}
          priority
          style={{ width: '100px', height: '100px' }}
        />
        <div className="text-[1.8rem] text-text-light mt-6 font-bold">
          Witajcie na stronie Sklepu Komputerowego 2025KL!
        </div>
        <div className="text-text-muted mt-3">
          Prosty sklep demonstracyjny — stylowany lokalnie.
        </div>
      </main>
    </div>
  );
}
