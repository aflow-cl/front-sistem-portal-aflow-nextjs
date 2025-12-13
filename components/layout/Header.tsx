import Link from "next/link";
import Image from "next/image";
import { NavPublic } from "./NavPublic";

export function Header() {
  return (
    <header className="sticky top-4 z-50 w-full px-2 sm:px-4">
      <div className="container mx-auto border rounded-lg bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center gap-2">
              <Image 
                src="/images/company/LogoSinFondoTexto.png" 
                alt="AFLOW Logo" 
                width={95} 
                height={40}
                className="object-contain"
              />
            </div>
          </Link>
          <NavPublic />
        </div>
      </div>
    </header>
  );
}
