'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <footer className="bg-primary text-white mt-auto border-t-[3px] border-accent">
      <div className="max-w-[1200px] mx-auto p-8">
        <div className="text-center flex flex-col gap-3">
          <p className="m-0 text-[0.95rem] font-semibold">
            © {currentYear} - Autor: Kamil Lenczyk
          </p>
          <p className="m-0 text-[#e0e0e0] text-[0.9rem]">
            Aktualna data: {currentDate}
          </p>
          <p className="m-0">
            <Link 
              href="https://www.pk.edu.pl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent no-underline font-medium transition-all duration-200 hover:text-white hover:underline"
            >
              Politechnika Krakowska
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}