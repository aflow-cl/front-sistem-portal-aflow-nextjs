"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMiCuenta } from "../hooks/useMiCuenta";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { UserPreferences } from "../types/miCuenta";

/**
 * Configuración de preferencias del usuario
 */
export function Preferences() {
  const { user } = useAuth();
  const { getPreferences, updatePreferences, loading } = useMiCuenta();

  const [preferences, setPreferences] = useState<UserPreferences>({
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    theme: "light",
    language: "es",
    timezone: "America/Santiago",
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    if (!user) return;

    const prefs = await getPreferences(user.id);
    if (prefs) {
      setPreferences(prefs);
    }
  };

  const handleNotificationChange = (key: keyof UserPreferences["notifications"]) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      await updatePreferences(user.id, preferences);
      toast.success("Preferencias actualizadas exitosamente");
    } catch (error) {
      toast.error("Error al actualizar las preferencias");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferencias</CardTitle>
        <CardDescription>
          Configura tus preferencias de notificaciones y sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Notificaciones */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Notificaciones</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="flex flex-col">
                <span>Notificaciones por Email</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Recibe notificaciones en tu correo electrónico
                </span>
              </Label>
              <Switch
                id="email-notifications"
                checked={preferences.notifications.email}
                onCheckedChange={() => handleNotificationChange("email")}
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="flex flex-col">
                <span>Notificaciones Push</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Recibe notificaciones en el navegador
                </span>
              </Label>
              <Switch
                id="push-notifications"
                checked={preferences.notifications.push}
                onCheckedChange={() => handleNotificationChange("push")}
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifications" className="flex flex-col">
                <span>Notificaciones por SMS</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Recibe notificaciones en tu teléfono
                </span>
              </Label>
              <Switch
                id="sms-notifications"
                checked={preferences.notifications.sms}
                onCheckedChange={() => handleNotificationChange("sms")}
                disabled={loading}
              />
            </div>
          </div>

          {/* Sistema */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Sistema</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Idioma</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">Español</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Zona Horaria</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">Santiago, Chile (GMT-3)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="aflow" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Preferencias"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
