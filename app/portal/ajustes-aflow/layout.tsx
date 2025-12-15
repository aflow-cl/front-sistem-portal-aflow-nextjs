"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, LayoutDashboard, Users, Shield, Menu as MenuIcon, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    name: "Dashboard",
    href: "/portal/ajustes-aflow/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Clientes",
    href: "/portal/ajustes-aflow/clientes",
    icon: Users,
  },
  {
    name: "Perfiles",
    href: "/portal/ajustes-aflow/perfiles",
    icon: Shield,
  },
  {
    name: "Opciones de Menú",
    href: "/portal/ajustes-aflow/opciones-menu",
    icon: MenuIcon,
  },
  {
    name: "Servicios",
    href: "/portal/ajustes-aflow/servicios",
    icon: Package,
  },
];

export default function AjustesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {/* Header del módulo */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#244F82] to-[#0c3b64] flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Ajustes AFLOW
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Configuración y administración del sistema
            </p>
          </div>
        </div>

        {/* Navegación horizontal por tabs */}
        <nav className="flex gap-1 overflow-x-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "bg-[#244F82] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Contenido del submódulo */}
      <div>{children}</div>
    </div>
  );
}
