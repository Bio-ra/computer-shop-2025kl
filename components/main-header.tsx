import Link from 'next/link';
import Image from 'next/image';
import NavLink from './nav-link';

export default function MainHeader() {
  return (
    <header className="bg-primary px-8 py-4">
      <div className="max-w-[1200px] mx-auto flex items-center gap-12 flex-col md:flex-row md:gap-12">
        <Link href="/" className="flex">
          <Image 
              src="/favicon.ico" 
              alt="Logo Sklepu" 
              width={100} 
              height={100}
              className="w-[100px] h-[100px] rounded"
              style={{ width: '100px', height: '100px' }}
            />
        </Link>
        
        <nav className="flex-1">
          <ul className="list-none m-0 p-0 flex gap-8 flex-col md:flex-row md:gap-8">
            <li>
              <NavLink href="/about">O nas</NavLink>
            </li>
            <li>
              <NavLink href="/order-history">Historia zamówień</NavLink>
            </li>
            <li>
              <NavLink href="/product-list">Lista produktów</NavLink>
            </li>
            <li>
              <NavLink href="/basket">Koszyk</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}