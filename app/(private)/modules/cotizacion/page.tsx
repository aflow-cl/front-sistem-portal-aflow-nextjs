"use client";

import { FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Módulo Cotización (Placeholder)
 */
export default function CotizacionPage() {
  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-500 rounded-lg">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-poppins font-bold">Cotización</h1>
          <p className="text-muted-foreground">
            Módulo de gestión de cotizaciones
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
            El módulo de Cotización permitirá:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Crear y gestionar cotizaciones</li>
            <li>Enviar cotizaciones a clientes</li>
            <li>Seguimiento de estados</li>
            <li>Conversión a órdenes de compra</li>
          </ul>
          <Button variant="aflow" className="mt-6">
            Configurar Módulo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
