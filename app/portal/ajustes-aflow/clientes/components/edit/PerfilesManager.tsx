"use client";

import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Cliente } from "../../../types/ajustes";

interface PerfilesManagerProps {
  cliente: Cliente;
  onUpdate: () => void;
}

export function PerfilesManager({ }: PerfilesManagerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gestión de Perfiles</h3>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 mb-2">Gestión de perfiles personalizados</p>
          <p className="text-sm text-gray-400">
            Esta sección permite configurar perfiles de acceso específicos para este
            cliente. Próximamente disponible.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
