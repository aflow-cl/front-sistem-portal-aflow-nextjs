"use client";

import { Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Módulo Clientes (Placeholder)
 */
export default function ClientesPage() {
  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-purple-500 rounded-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-poppins font-bold">Clientes</h1>
          <p className="text-muted-foreground">
            Módulo de gestión de clientes
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
            El módulo de Clientes permitirá:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Registro y gestión de clientes</li>
            <li>Historial de interacciones</li>
            <li>Seguimiento de oportunidades</li>
            <li>Análisis de cartera de clientes</li>
          </ul>
          <Button variant="aflow" className="mt-6">
            Configurar Módulo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
