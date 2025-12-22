/**
 * Formulario de Usuario para el wizard de creación de Contratante
 * Limitado a 1 usuario por contratante
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Mail, Lock, Shield, AlertCircle } from "lucide-react";

// Schema de validación
const usuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email("Email inválido").min(1, "El email es obligatorio"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),
  rol: z.enum(["admin", "usuario"], {
    required_error: "Debe seleccionar un rol",
  }),
  activo: z.boolean().default(true),
  enviarInvitacion: z.boolean().default(true),
});

export type UsuarioFormValues = z.infer<typeof usuarioSchema>;

interface UsuarioFormProps {
  onSubmit: (data: UsuarioFormValues) => void;
  initialData?: Partial<UsuarioFormValues>;
  contratanteNombre: string;
  sucursalNombre: string;
}

export function UsuarioForm({
  onSubmit,
  initialData,
  contratanteNombre,
  sucursalNombre,
}: UsuarioFormProps) {
  const form = useForm<UsuarioFormValues>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      apellido: initialData?.apellido || "",
      email: initialData?.email || "",
      password: initialData?.password || "",
      rol: initialData?.rol || "usuario",
      activo: initialData?.activo ?? true,
      enviarInvitacion: initialData?.enviarInvitacion ?? true,
    },
  });

  const handleSubmit = (data: UsuarioFormValues) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs sm:text-sm font-semibold text-purple-900">
              Creando usuario para: {contratanteNombre}
            </p>
            <p className="text-xs text-purple-700 mt-1">
              Sucursal: {sucursalNombre}
            </p>
            <p className="text-xs text-purple-600 mt-2 font-medium">
              ⚠️ Límite: 1 usuario por contratante
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Datos Personales */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#FF7A00]" />
              Datos Personales
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Nombre *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Juan"
                        className="text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Apellido *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Pérez"
                        className="text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Email *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="usuario@ejemplo.cl"
                        className="pl-9 text-sm sm:text-base"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm">
                    Este email se usará para iniciar sesión en el sistema.
                  </FormDescription>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>

          {/* Credenciales */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#FF7A00]" />
              Credenciales de Acceso
            </h3>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Contraseña *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="pl-9 text-sm sm:text-base"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm">
                    Mínimo 8 caracteres, con mayúsculas, minúsculas y números.
                  </FormDescription>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Rol de Usuario *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-sm sm:text-base">
                        <SelectValue placeholder="Seleccione un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin" className="text-sm sm:text-base">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-[#FF7A00]" />
                          <div>
                            <p className="font-semibold">Administrador</p>
                            <p className="text-xs text-gray-500">
                              Acceso completo y gestión de datos
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="usuario" className="text-sm sm:text-base">
                        <div className="flex items-center gap-2">
                          <UserPlus className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="font-semibold">Usuario</p>
                            <p className="text-xs text-gray-500">
                              Acceso limitado a funciones básicas
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>

          {/* Configuración */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">
              Configuración
            </h3>

            <div className="space-y-3">
              <FormField
                control={form.control}
                name="activo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 sm:p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm sm:text-base">
                        Usuario activo
                      </FormLabel>
                      <FormDescription className="text-xs sm:text-sm">
                        El usuario podrá iniciar sesión inmediatamente.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enviarInvitacion"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 sm:p-4 bg-blue-50 border-blue-200">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm sm:text-base text-blue-900">
                        Enviar invitación por email
                      </FormLabel>
                      <FormDescription className="text-xs sm:text-sm text-blue-700">
                        Se enviará un correo con las credenciales de acceso.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
