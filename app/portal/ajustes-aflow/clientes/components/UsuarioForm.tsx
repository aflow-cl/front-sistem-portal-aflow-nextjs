"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPerfiles } from "../../api/ajustesService";
import type { UsuarioData } from "../../types/ajustes";

const usuarioSchema = z.object({
  primerNombre: z.string().min(1, "Primer nombre es requerido"),
  segundoNombre: z.string().optional(),
  apellidoPaterno: z.string().min(1, "Apellido paterno es requerido"),
  apellidoMaterno: z.string().optional(),
  rut: z.string().optional(),
  clave: z.string().min(8, "La clave debe tener 8 caracteres").max(8, "La clave debe tener 8 caracteres"),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(1, "Teléfono es requerido"),
  perfilId: z.string().min(1, "Perfil es requerido"),
});

export type UsuarioFormValues = z.infer<typeof usuarioSchema>;

interface UsuarioFormProps {
  initialData?: UsuarioData | null;
  onSubmit: (data: UsuarioFormValues) => void;
  onBack: () => void;
}

export function UsuarioForm({ initialData, onSubmit, onBack }: UsuarioFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UsuarioFormValues>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: initialData || {
      primerNombre: "",
      segundoNombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      rut: "",
      clave: "", // Se asignará en useEffect
      email: "",
      telefono: "",
      perfilId: "",
    },
  });

  // Asignar clave aleatoria por defecto al montar si no hay valor
  useEffect(() => {
    if (!initialData?.clave) {
      setValue("clave", generarClaveAleatoria());
    }
  }, [initialData, setValue]);

  // Función para generar clave aleatoria alfanumérica de 8 caracteres
  function generarClaveAleatoria() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let clave = '';
    for (let i = 0; i < 8; i++) {
      clave += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return clave;
  }

  const { data: perfiles, isLoading: isLoadingPerfiles } = useQuery({
    queryKey: ["perfiles"],
    queryFn: fetchPerfiles,
  });

  const watchPerfilId = watch("perfilId");

  // Set default profile if available
  useEffect(() => {
    if (perfiles && perfiles.length > 0 && !watchPerfilId && !initialData?.perfilId) {
      const defaultPerfil = perfiles.find((p) => p.nivel === "Operador") || perfiles[0];
      setValue("perfilId", defaultPerfil.id);
    }
  }, [perfiles, watchPerfilId, initialData, setValue]);

  const handleFormSubmit = (data: UsuarioFormValues) => {
    onSubmit(data);
  };

  const selectedPerfil = perfiles?.find((p) => p.id === watchPerfilId);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 flex items-start gap-2">
        <UserPlus className="w-5 h-5 text-[#244F82] mt-0.5" />
        <div>
          <p className="font-medium text-gray-900">Usuario Principal</p>
          <p className="text-sm text-gray-600 mt-1">
            Crea el primer usuario que tendrá acceso al sistema. Podrás agregar más usuarios después.
          </p>
        </div>
      </div>


      {/* Nombres y Apellidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Label htmlFor="primerNombre">Primer Nombre *</Label>
          <Input
            id="primerNombre"
            {...register("primerNombre")}
            placeholder="Juan"
            className={errors.primerNombre ? "border-red-500" : ""}
          />
          {errors.primerNombre && (
            <p className="text-sm text-red-600 mt-1">{errors.primerNombre.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="segundoNombre">Segundo Nombre</Label>
          <Input
            id="segundoNombre"
            {...register("segundoNombre")}
            placeholder="Carlos (opcional)"
            className={errors.segundoNombre ? "border-red-500" : ""}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Label htmlFor="apellidoPaterno">Apellido Paterno *</Label>
          <Input
            id="apellidoPaterno"
            {...register("apellidoPaterno")}
            placeholder="García"
            className={errors.apellidoPaterno ? "border-red-500" : ""}
          />
          {errors.apellidoPaterno && (
            <p className="text-sm text-red-600 mt-1">{errors.apellidoPaterno.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
          <Input
            id="apellidoMaterno"
            {...register("apellidoMaterno")}
            placeholder="López (opcional)"
            className={errors.apellidoMaterno ? "border-red-500" : ""}
          />
        </div>
      </div>

      {/* Rut y Clave */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Label htmlFor="rut">RUT</Label>
          <Input
            id="rut"
            {...register("rut")}
            placeholder="12.345.678-9 (opcional)"
            className={errors.rut ? "border-red-500" : ""}
          />
        </div>
        <div>
          <Label htmlFor="clave">Clave *</Label>
          <Input
            id="clave"
            {...register("clave")}
            placeholder="Clave autogenerada"
            className={errors.clave ? "border-red-500" : ""}
            maxLength={8}
            minLength={8}
            autoComplete="off"
          />
          {errors.clave && (
            <p className="text-sm text-red-600 mt-1">{errors.clave.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">La clave debe ser alfanumérica de 8 caracteres</p>
        </div>
      </div>

      {/* Email y Teléfono */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="usuario@ejemplo.cl"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Se enviará un correo de activación a esta dirección
          </p>
        </div>

        <div>
          <Label htmlFor="telefono">Teléfono *</Label>
          <Input
            id="telefono"
            {...register("telefono")}
            placeholder="+56 9 1234 5678"
            className={errors.telefono ? "border-red-500" : ""}
          />
          {errors.telefono && (
            <p className="text-sm text-red-600 mt-1">{errors.telefono.message}</p>
          )}
        </div>
      </div>

      {/* Perfil */}
      <div>
        <Label htmlFor="perfilId">Perfil de Usuario *</Label>
        {isLoadingPerfiles ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <>
            <Select
              value={watchPerfilId}
              onValueChange={(value) => setValue("perfilId", value)}
            >
              <SelectTrigger id="perfilId" className={errors.perfilId ? "border-red-500" : ""}>
                <SelectValue placeholder="Seleccionar perfil" />
              </SelectTrigger>
              <SelectContent>
                {perfiles?.filter((p) => p.activo).map((perfil) => (
                  <SelectItem key={perfil.id} value={perfil.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: perfil.color }}
                      />
                      <span>{perfil.nombre}</span>
                      <span className="text-xs text-gray-500">({perfil.nivel})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.perfilId && (
              <p className="text-sm text-red-600 mt-1">{errors.perfilId.message}</p>
            )}
            {selectedPerfil && (
              <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{selectedPerfil.nombre}</p>
                <p className="text-xs text-gray-600 mt-1">{selectedPerfil.descripcion}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-medium text-gray-700">Nivel:</span>
                  <span className="text-xs px-2 py-1 bg-white rounded border">
                    {selectedPerfil.nivel}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Botones de Navegación */}
      <div className="flex justify-between pt-2 border-t mt-2 gap-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button
          type="submit"
          className="bg-[#244F82] hover:bg-[#0c3b64]"
          disabled={isLoadingPerfiles}
        >
          Siguiente
        </Button>
      </div>
    </form>
  );
}
