"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useMenu } from "@/hooks/useMenu";
import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";
import { ROUTES } from "@/lib/constants";

/**
 * Layout para rutas privadas (requieren autenticación)
 */
export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const { menuGroups, loading: menuLoading } = useMenu();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(ROUTES.LOGIN);
    }
  }, [user, authLoading, router]);

  if (authLoading || menuLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-aflow-orange border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar menuGroups={menuGroups} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
