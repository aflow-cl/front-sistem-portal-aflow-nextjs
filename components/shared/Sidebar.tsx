"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Globe, 
  Shield, 
  DollarSign, 
  Users, 
  User, 
  UserCheck,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import type { MenuGroup } from "@/types";
import { useState } from "react";

interface SidebarProps {
  menuGroups: MenuGroup[];
}

// Iconos por módulo
const MODULE_ICONS: Record<string, any> = {
  dashboard: LayoutDashboard,
  cotizacion: FileText,
  comex: Globe,
  guardia: Shield,
  finanzas: DollarSign,
  clientes: Users,
  micuenta: User,
  contratante: UserCheck,
};

/**
 * Sidebar - Menú lateral del portal
 */
export function Sidebar({ menuGroups }: SidebarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-aflow-orange rounded-lg flex items-center justify-center">
            <span className="text-white font-poppins font-bold text-xl">A</span>
          </div>
          <div>
            <h1 className="text-xl font-poppins font-bold text-foreground">AFLOW</h1>
            <p className="text-xs text-muted-foreground">Portal Empresarial</p>
          </div>
        </Link>
      </div>

      {/* Menu Groups */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        {menuGroups.map((group) => (
          <div key={group.id}>
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = MODULE_ICONS[item.id] || LayoutDashboard;
                const isActive = pathname === item.path;

                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-aflow-orange text-white shadow-md"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-center text-muted-foreground">
          AFLOW Portal v1.0.0
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-border"
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-background border-r border-border h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-background border-r border-border z-50 animate-in slide-in-from-left">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
