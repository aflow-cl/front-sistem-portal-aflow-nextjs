"use client";

import { Bell, Settings, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";

/**
 * Header - Barra superior del portal
 */
export function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
  };

  const handleProfile = () => {
    router.push(ROUTES.MODULES.MI_CUENTA);
  };

  return (
    <header className="h-16 bg-white border-b border-border sticky top-0 z-30 shadow-sm">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left Section - Breadcrumb/Title */}
        <div className="flex items-center space-x-4">
          <div className="lg:hidden w-12" /> {/* Spacer for mobile menu button */}
          <div>
            <h2 className="text-lg font-poppins font-semibold text-foreground">
              {user ? `Bienvenido, ${user.nombre}` : "Portal AFLOW"}
            </h2>
            {user && (
              <p className="text-xs text-muted-foreground">
                {user.cargo} • {user.departamento}
              </p>
            )}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-aflow-orange rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-4 text-center text-sm text-muted-foreground">
                No hay notificaciones nuevas
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 h-10">
                <div className="w-8 h-8 rounded-full bg-aflow-orange flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.nombre.charAt(0)}{user?.apellido.charAt(0)}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">
                    {user?.nombre} {user?.apellido}
                  </p>
                  <Badge variant="outline" className="text-xs mt-0.5">
                    {user?.role}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user?.nombre} {user?.apellido}</p>
                  <p className="text-xs text-muted-foreground font-normal">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile}>
                <UserIcon className="mr-2 h-4 w-4" />
                Mi Cuenta
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(ROUTES.SETTINGS)}>
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
