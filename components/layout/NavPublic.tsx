import Link from "next/link";

export function NavPublic() {
  return (
    <nav className="flex items-center gap-8">
      <Link
        href="/"
        className="text-sm font-medium text-gray-700 hover:text-aflow-blue transition-colors"
      >
        Inicio
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
  );
}
