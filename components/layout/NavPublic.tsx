"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function NavPublic() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <Link
          href="/"
          className="text-sm font-medium text-gray-700 hover:text-aflow-blue transition-colors"
        >
          Inicio
        </Link>
        <Link
          href="/#soluciones"
          className="text-sm font-medium text-gray-700 hover:text-aflow-blue transition-colors"
        >
          Soluciones
        </Link>
        <Link
          href="/#beneficios"
          className="text-sm font-medium text-gray-700 hover:text-aflow-blue transition-colors"
        >
          Beneficios
        </Link>
        <Link
          href="https://www.aflow.cl/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Sitio Web
        </Link>
        <Link
          href="/login"
          className="text-sm font-medium bg-aflow-blue text-white px-6 py-2 rounded-lg hover:bg-aflow-blue-light transition-colors"
        >
          Iniciar Sesión
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-gray-700 hover:text-aflow-blue transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-4 right-4 bg-white border rounded-lg shadow-lg p-4 z-50">
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-gray-700 hover:text-aflow-blue transition-colors py-2"
            >
              Inicio
            </Link>
            <Link
              href="/#soluciones"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-gray-700 hover:text-aflow-blue transition-colors py-2"
            >
              Soluciones
            </Link>
            <Link
              href="/#beneficios"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-gray-700 hover:text-aflow-blue transition-colors py-2"
            >
              Beneficios
            </Link>
            <Link
              href="https://www.aflow.cl/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors text-center"
            >
              Sitio Web
            </Link>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium bg-aflow-blue text-white px-6 py-2 rounded-lg hover:bg-aflow-blue-light transition-colors text-center"
            >
              Iniciar Sesión
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
