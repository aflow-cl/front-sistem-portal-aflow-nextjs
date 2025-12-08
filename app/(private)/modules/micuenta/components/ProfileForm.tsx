"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMiCuenta } from "../hooks/useMiCuenta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { ProfileFormData } from "../types/miCuenta";

/**
 * Formulario de edición de perfil
 */
export function ProfileForm() {
  const { user, updateProfile: updateAuthProfile } = useAuth();
  const { updateProfile, loading } = useMiCuenta();

  const [formData, setFormData] = useState<ProfileFormData>({
    nombre: user?.nombre || "",
    apellido: user?.apellido || "",
    email: user?.email || "",
    telefono: user?.telefono || "",
    cargo: user?.cargo || "",
    departamento: user?.departamento || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      await updateProfile(user.id, formData);
      await updateAuthProfile(formData);
      toast.success("Perfil actualizado exitosamente");
    } catch (error) {
      toast.error("Error al actualizar el perfil");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Personal</CardTitle>
        <CardDescription>
          Actualiza tu información de perfil
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            {/* Apellido */}
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Cargo */}
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Departamento */}
            <div className="space-y-2">
              <Label htmlFor="departamento">Departamento</Label>
              <Input
                id="departamento"
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="aflow" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
