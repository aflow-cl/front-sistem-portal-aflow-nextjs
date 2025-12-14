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
      shortLabel: "Consultar",
      href: "/portal/presupuesto/consultar",
      icon: FileText,
    },
    {
      label: "Crear Cotización",
      shortLabel: "Crear",
      href: "/portal/presupuesto/crear",
      icon: PlusCircle,
    },
    {
      label: "Historia de acciones",
      shortLabel: "Historia",
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
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Presupuesto
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">
            Gestión de presupuestos y cotizaciones
          </p>
        </div>

        {/* Horizontal Navigation aligned with content below */}
        <div className="border-b border-gray-200">
          <nav 
            className="flex gap-0.5 sm:gap-1 overflow-x-auto scrollbar-hide -mb-px" 
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
                    flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap
                    border-b-2 transition-colors flex-shrink-0
                    ${
                      isActive
                        ? "border-[#244F82] text-[#244F82]"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                    }
                  `}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden md:inline">{item.label}</span>
                  <span className="md:hidden">{item.shortLabel}</span>
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
