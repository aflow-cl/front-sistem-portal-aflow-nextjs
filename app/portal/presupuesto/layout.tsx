"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FileText, PlusCircle, History } from "lucide-react";

export default function PresupuestoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Consultar",
      href: "/portal/presupuesto/consultar",
      icon: FileText,
    },
    {
      label: "Crear Cotización",
      href: "/portal/presupuesto/crear",
      icon: PlusCircle,
    },
    {
      label: "Historia de acciones",
      href: "/portal/presupuesto/historia",
      icon: History,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Integrated Header: Title + Nav in same visual block */}
      <div className="space-y-3">
        {/* Title and Subtitle */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Presupuesto
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Gestión de presupuestos y cotizaciones
          </p>
        </div>

        {/* Horizontal Navigation aligned with content below */}
        <div className="border-b border-gray-200">
          <nav 
            className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px" 
            aria-label="Navegación del módulo de presupuesto"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                    border-b-2 transition-colors
                    ${
                      isActive
                        ? "border-[#244F82] text-[#244F82]"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">
                    {item.label === "Crear Cotización" ? "Crear" : item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
