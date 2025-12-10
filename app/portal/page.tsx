"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PortalPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bienvenido al Portal AFLOW</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-aflow-orange to-orange-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-poppins">
            Información de Usuario
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
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
            <Separator />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Puedes acceder a los módulos del sistema
                utilizando el menú lateral.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
