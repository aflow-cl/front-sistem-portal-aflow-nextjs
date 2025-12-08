"use client";

import { Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Módulo Comex (Placeholder)
 */
export default function ComexPage() {
  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-green-500 rounded-lg">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-poppins font-bold">Comex</h1>
          <p className="text-muted-foreground">
            Módulo de comercio exterior
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
            El módulo COMEX permitirá:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Gestión de importaciones y exportaciones</li>
            <li>Control de documentación aduanera</li>
            <li>Seguimiento de embarques</li>
            <li>Gestión de agentes de aduana</li>
          </ul>
          <Button variant="aflow" className="mt-6">
            Configurar Módulo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
