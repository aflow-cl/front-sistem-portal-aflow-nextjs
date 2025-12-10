import Link from "next/link";
import { NavPublic } from "./NavPublic";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-aflow-orange rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-poppins font-bold text-xl text-gray-dark">
              AFLOW
            </span>
          </div>
        </Link>
        <NavPublic />
      </div>
    </header>
  );
}
