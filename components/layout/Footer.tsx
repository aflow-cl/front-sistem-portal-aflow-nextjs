export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-gray-50 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-aflow-blue rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-poppins font-semibold text-gray-dark">
              AFLOW Portal
            </span>
          </div>
          <p className="text-sm text-gray-600">
            © {currentYear} AFLOW. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a
              href="/privacidad"
              className="text-sm text-gray-600 hover:text-aflow-blue transition-colors"
            >
              Privacidad
            </a>
            <a
              href="/terminos"
              className="text-sm text-gray-600 hover:text-aflow-blue transition-colors"
            >
              Términos
            </a>
            <a
              href="/soporte"
              className="text-sm text-gray-600 hover:text-aflow-blue transition-colors"
            >
              Soporte
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
