"use client";

import { Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Módulo Guardia (Placeholder)
 */
export default function GuardiaPage() {
  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-red-500 rounded-lg">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-poppins font-bold">Guardia</h1>
          <p className="text-muted-foreground">
            Módulo de gestión de guardias
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Módulo en Desarrollo</CardTitle>
          <CardDescription>
            Esta funcionalidad estará disponible próximamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            El módulo de Guardia permitirá:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Registro de turnos de guardia</li>
            <li>Control de accesos</li>
            <li>Reportes de incidentes</li>
            <li>Gestión de personal de seguridad</li>
          </ul>
          <Button variant="aflow" className="mt-6">
            Configurar Módulo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
