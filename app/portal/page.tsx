"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LogOut, User } from "lucide-react";

export default function PortalPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-aflow-orange rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-poppins font-bold text-xl text-gray-dark">
              AFLOW Portal 
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {user?.nombre} {user?.apellido}
              </span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-600 hover:text-aflow-orange"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión.
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-aflow-orange to-orange-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-poppins">
                Bienvenido al Portal AFLOW
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-lg text-gray-700">
                  Esta es la página maestra privada del sistema.
                </p>
                <Separator />
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Información de Usuario
                  </h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Nombre:</dt>
                      <dd className="font-medium text-gray-900">
                        {user?.nombre} {user?.apellido}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Email:</dt>
                      <dd className="font-medium text-gray-900">
                        {user?.email}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Rol:</dt>
                      <dd className="font-medium text-gray-900">
                        {user?.role}
                      </dd>
                    </div>
                    {user?.cargo && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Cargo:</dt>
                        <dd className="font-medium text-gray-900">
                          {user.cargo}
                        </dd>
                      </div>
                    )}
                    {user?.departamento && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Departamento:</dt>
                        <dd className="font-medium text-gray-900">
                          {user.departamento}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> Este es el layout privado maestro.
                    Los módulos adicionales (Dashboard, Contratante, etc.) se
                    agregarán en futuras extensiones del proyecto.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
