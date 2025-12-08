"use client";

import { useState } from "react";
import { useMiCuenta } from "../hooks/useMiCuenta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { ChangePasswordFormData } from "../types/miCuenta";

/**
 * Formulario de cambio de contraseña
 */
export function ChangePassword() {
  const { changePassword, loading } = useMiCuenta();

  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (formData.newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      await changePassword(formData);
      toast.success("Contraseña actualizada exitosamente");
      
      // Limpiar formulario
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al cambiar la contraseña");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cambiar Contraseña</CardTitle>
        <CardDescription>
          Actualiza tu contraseña de acceso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contraseña Actual */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña Actual</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          {/* Nueva Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              disabled={loading}
              required
              minLength={6}
            />
            <p className="text-xs text-muted-foreground">
              Mínimo 6 caracteres
            </p>
          </div>

          {/* Confirmar Nueva Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
              minLength={6}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="aflow" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar Contraseña"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
