"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Menu, Home, Calculator, LogOut, User, X, Settings, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QueryProvider } from "@/providers/QueryProvider";
import Link from "next/link";
import Image from "next/image";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-aflow-blue mx-auto mb-4" />
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/portal",
      section: "general"
    },
    {
      title: "Presupuesto",
      icon: Calculator,
      href: "/portal/presupuesto",
      section: "presupuesto"
    },
    {
      title: "Maestro de Negocio",
      icon: Briefcase,
      href: "/portal/maestro-negocio",
      section: "maestro-negocio"
    },
    {
      title: "Portal Aflow",
      icon: Settings,
      href: "/portal/ajustes-aflow",
      section: "ajustes"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm fixed top-0 left-0 right-0 z-30 h-16">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Image 
                src="/images/company/LogoSinFondoTexto.png" 
                alt="AFLOW Logo" 
                width={60}
                height={20}
                className="object-contain"
                priority
              />
              <span className="font-poppins font-bold text-lg text-blue-950">
                AFLOW
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {user?.nombre} {user?.apellido}
              </span>
            </div>
            <Separator orientation="vertical" className="hidden md:block h-6" />
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-600 hover:text-aflow-blue"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 top-16"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 bg-white border-r shadow-lg transition-transform duration-300 z-50 w-64 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header del Sidebar */}
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="font-semibold text-gray-800">Menú</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? "bg-aflow-blue text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium text-sm">{item.title}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-16">
        <QueryProvider>
          <div className="p-6">{children}</div>
        </QueryProvider>
      </main>
    </div>
  );
}
