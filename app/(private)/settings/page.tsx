"use client";

import { Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Página de Configuración (Placeholder)
 */
export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gray-700 rounded-lg">
          <Settings className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-poppins font-bold">Configuración</h1>
          <p className="text-muted-foreground">
            Configuración del sistema
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración del Sistema</CardTitle>
          <CardDescription>
            Personaliza el comportamiento del portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Las opciones de configuración incluyen:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Configuración general del sistema</li>
            <li>Gestión de usuarios y permisos</li>
            <li>Parámetros de módulos</li>
            <li>Integraciones con terceros</li>
          </ul>
          <Button variant="aflow" className="mt-6">
            Administrar Configuración
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
