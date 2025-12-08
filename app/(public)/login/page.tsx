"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/data/supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ROUTES, MESSAGES, MOCK_CREDENTIALS } from "@/lib/constants";
import { appLogger } from "@/core/logging/logger";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

/**
 * Página de Login - AFLOW Portal
 */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error(MESSAGES.LOGIN.REQUIRED);
      return;
    }

    try {
      setLoading(true);
      appLogger.auth("Login attempt", { email });

      const session = await auth.signIn(email, password);

      if (!session) {
        toast.error(MESSAGES.LOGIN.ERROR);
        return;
      }

      toast.success(MESSAGES.LOGIN.SUCCESS);
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      appLogger.error("Login error", error);
      toast.error(MESSAGES.LOGIN.ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-dark via-gray-medium to-aflow-black p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-light hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Volver al inicio</span>
        </Link>

        {/* Logo */}
        <div className="text-center mb-8 animate-in">
          <h1 className="text-4xl md:text-5xl font-poppins font-bold text-white mb-2">
            AFLOW
          </h1>
          <p className="text-gray-light text-sm md:text-base font-inter">
            Portal Empresarial
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-none animate-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-poppins text-center">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center">
              Ingrese sus credenciales para acceder al portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@aflow.cl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="h-11"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="h-11"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="aflow"
                className="w-full h-11 text-base font-medium gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Ingresar"
                )}
              </Button>
            </form>

            {/* Development Credentials */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-2 font-medium">
                Credenciales de desarrollo:
              </p>
              <div className="space-y-1 text-xs font-mono">
                <p className="text-foreground">
                  <span className="text-muted-foreground">Admin:</span>{" "}
                  {MOCK_CREDENTIALS.EMAIL} / {MOCK_CREDENTIALS.PASSWORD}
                </p>
                <p className="text-foreground">
                  <span className="text-muted-foreground">Analista:</span>{" "}
                  analista@aflow.cl / 123456
                </p>
                <p className="text-foreground">
                  <span className="text-muted-foreground">Operador:</span>{" "}
                  operador@aflow.cl / 123456
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-gray-light text-sm mt-6">
          © {new Date().getFullYear()} AFLOW. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
