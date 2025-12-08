"use client";

import { User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "./components/ProfileForm";
import { ChangePassword } from "./components/ChangePassword";
import { Preferences } from "./components/Preferences";

/**
 * Página Mi Cuenta
 */
export default function MiCuentaPage() {
  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-aflow-orange rounded-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-poppins font-bold">Mi Cuenta</h1>
          <p className="text-muted-foreground">
            Administra tu información personal y preferencias
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="password">Contraseña</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileForm />
        </TabsContent>

        <TabsContent value="password" className="space-y-4">
          <ChangePassword />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Preferences />
        </TabsContent>
      </Tabs>
    </div>
  );
}
