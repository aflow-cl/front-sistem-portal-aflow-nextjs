"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import Image from "next/image";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Email inválido")
    .toLowerCase(),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      setIsLoading(true);

      const result = await login(data);

      if (result.success) {
        toast.success("Inicio de sesión exitoso", {
          description: "Redirigiendo al portal...",
        });

        // Redirect to private area
        setTimeout(() => {
          router.push("/portal");
          router.refresh();
        }, 500);
      } else {
        toast.error("Error al iniciar sesión", {
          description: result.error || "Credenciales inválidas",
        });
      }
    } catch {
      toast.error("Error inesperado", {
        description: "Por favor, intenta nuevamente",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0b0c] via-[#141518] to-[#0d0e10] text-foreground p-4">
      {/* Background particles (subtle, behind content) */}
      <div className="absolute inset-0 pointer-events-none">
        <ParticleBackground />
        {/* Readability overlay for serious tone */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-aflow-orange mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <Card className="bg-card/95 backdrop-blur-sm border border-border/60 shadow-2xl shadow-black/40">
          <CardHeader className="space-y-3">
            <div className="flex justify-center mb-2">
              <Image
                src="/images/company/LogoSinFondoTexto.png"
                alt="AFLOW Logo"
                width={80}
                height={30}
                className="object-contain"
                priority
              />
            </div>
            <CardTitle className="text-3xl font-poppins font-bold text-center bg-gradient-to-r from-aflow-orange to-orange-500 bg-clip-text text-transparent">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-black text-center text-base font-medium">
              Ingresa tus credenciales para acceder al portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-aflow-orange font-semibold">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="usuario@aflow.cl"
                          type="email"
                          autoComplete="email"
                          disabled={isLoading}
                          className="bg-white/95 border-gray-300 text-black placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-aflow-orange focus-visible:ring-offset-0 focus-visible:border-aflow-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 text-xs mt-1 font-medium" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-aflow-orange font-semibold">Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          autoComplete="current-password"
                          disabled={isLoading}
                          className="bg-white/95 border-gray-300 text-black placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-aflow-orange focus-visible:ring-offset-0 focus-visible:border-aflow-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 text-xs mt-1 font-medium" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-aflow-orange hover:bg-orange-600 shadow-lg shadow-black/30"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-gray-300 text-center">
              <p className="mb-2 font-medium">Credenciales de prueba:</p>
              <code className="bg-[#1a1c20] border border-[#3a3d43] px-3 py-2 rounded text-xs text-aflow-orange font-mono block">
                test@aflow.cl / 123456
              </code>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-gray-400 mt-6">
          © {new Date().getFullYear()} AFLOW. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
