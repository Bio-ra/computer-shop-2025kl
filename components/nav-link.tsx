"use client";

import Link from 'next/link';   
import { usePathname } from 'next/navigation';

export default function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const path = usePathname();
  
  return(
    <Link 
    href={href} 
    className={`text-white no-underline px-4 py-2 rounded transition-colors duration-200 ${
      path.startsWith(href) 
        ? 'bg-white/20 text-accent' 
        : 'hover:bg-white/20 hover:text-accent'
    }`}>
        {children}
    </Link>
  );
}