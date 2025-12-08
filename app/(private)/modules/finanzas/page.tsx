"use client";

import { DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Módulo Finanzas (Placeholder)
 */
export default function FinanzasPage() {
  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-emerald-500 rounded-lg">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-poppins font-bold">Finanzas</h1>
          <p className="text-muted-foreground">
            Módulo de gestión financiera
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
            El módulo de Finanzas permitirá:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Control de ingresos y egresos</li>
            <li>Facturación y cobranza</li>
            <li>Reportes financieros</li>
            <li>Gestión de presupuestos</li>
          </ul>
          <Button variant="aflow" className="mt-6">
            Configurar Módulo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
