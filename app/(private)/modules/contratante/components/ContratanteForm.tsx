"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Contratante, ContratanteFormData, TipoContratante } from "../types/contratante";
import { validateRut, formatRut } from "@/lib/utils";

interface ContratanteFormProps {
  contratante?: Contratante | null;
  onSubmit: (data: ContratanteFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

/**
 * Formulario de Contratante con validaciones
 */
export function ContratanteForm({
  contratante,
  onSubmit,
  onCancel,
  loading = false,
}: ContratanteFormProps) {
  const [formData, setFormData] = useState<ContratanteFormData>({
    tipo: "natural",
    nombreCompleto: "",
    razonSocial: "",
    rut: "",
    correo: "",
    telefono: "",
    direccion: "",
    activo: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContratanteFormData, string>>>({});

  useEffect(() => {
    if (contratante) {
      setFormData({
        tipo: contratante.tipo,
        nombreCompleto: contratante.nombreCompleto || "",
        razonSocial: contratante.razonSocial || "",
        rut: contratante.rut,
        correo: contratante.correo,
        telefono: contratante.telefono,
        direccion: contratante.direccion,
        activo: contratante.activo,
      });
    }
  }, [contratante]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo
    if (errors[name as keyof ContratanteFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleTipoChange = (value: TipoContratante) => {
    setFormData((prev) => ({
      ...prev,
      tipo: value,
      nombreCompleto: "",
      razonSocial: "",
    }));
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    setFormData((prev) => ({ ...prev, rut: formatted }));
    
    if (errors.rut) {
      setErrors((prev) => ({ ...prev, rut: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContratanteFormData, string>> = {};

    // Validar nombre según tipo
    if (formData.tipo === "natural") {
      if (!formData.nombreCompleto?.trim()) {
        newErrors.nombreCompleto = "El nombre completo es requerido";
      }
    } else {
      if (!formData.razonSocial?.trim()) {
        newErrors.razonSocial = "La razón social es requerida";
      }
    }

    // Validar RUT
    if (!formData.rut) {
      newErrors.rut = "El RUT es requerido";
    } else if (!validateRut(formData.rut)) {
      newErrors.rut = "RUT inválido";
    }

    // Validar correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo) {
      newErrors.correo = "El correo es requerido";
    } else if (!emailRegex.test(formData.correo)) {
      newErrors.correo = "Correo inválido";
    }

    // Validar teléfono
    if (!formData.telefono) {
      newErrors.telefono = "El teléfono es requerido";
    } else if (formData.telefono.replace(/\D/g, "").length < 9) {
      newErrors.telefono = "Teléfono inválido (mínimo 9 dígitos)";
    }

    // Validar dirección
    if (!formData.direccion?.trim()) {
      newErrors.direccion = "La dirección es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tipo de Contratante */}
      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo de Contratante *</Label>
        <Select
          value={formData.tipo}
          onValueChange={handleTipoChange}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="natural">Persona Natural</SelectItem>
            <SelectItem value="juridica">Persona Jurídica</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Nombre Completo (Persona Natural) */}
      {formData.tipo === "natural" && (
        <div className="space-y-2">
          <Label htmlFor="nombreCompleto">Nombre Completo *</Label>
          <Input
            id="nombreCompleto"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleChange}
            disabled={loading}
            placeholder="Ej: Juan Carlos Pérez González"
          />
          {errors.nombreCompleto && (
            <p className="text-sm text-destructive">{errors.nombreCompleto}</p>
          )}
        </div>
      )}

      {/* Razón Social (Persona Jurídica) */}
      {formData.tipo === "juridica" && (
        <div className="space-y-2">
          <Label htmlFor="razonSocial">Razón Social *</Label>
          <Input
            id="razonSocial"
            name="razonSocial"
            value={formData.razonSocial}
            onChange={handleChange}
            disabled={loading}
            placeholder="Ej: Transportes ABC S.A."
          />
          {errors.razonSocial && (
            <p className="text-sm text-destructive">{errors.razonSocial}</p>
          )}
        </div>
      )}

      {/* RUT */}
      <div className="space-y-2">
        <Label htmlFor="rut">RUT *</Label>
        <Input
          id="rut"
          name="rut"
          value={formData.rut}
          onChange={handleRutChange}
          disabled={loading}
          placeholder="12.345.678-9"
          className="font-mono"
        />
        {errors.rut && (
          <p className="text-sm text-destructive">{errors.rut}</p>
        )}
      </div>

      {/* Correo */}
      <div className="space-y-2">
        <Label htmlFor="correo">Correo Electrónico *</Label>
        <Input
          id="correo"
          name="correo"
          type="email"
          value={formData.correo}
          onChange={handleChange}
          disabled={loading}
          placeholder="correo@ejemplo.com"
        />
        {errors.correo && (
          <p className="text-sm text-destructive">{errors.correo}</p>
        )}
      </div>

      {/* Teléfono */}
      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono *</Label>
        <Input
          id="telefono"
          name="telefono"
          type="tel"
          value={formData.telefono}
          onChange={handleChange}
          disabled={loading}
          placeholder="+56912345678"
        />
        {errors.telefono && (
          <p className="text-sm text-destructive">{errors.telefono}</p>
        )}
      </div>

      {/* Dirección */}
      <div className="space-y-2">
        <Label htmlFor="direccion">Dirección *</Label>
        <Textarea
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          disabled={loading}
          placeholder="Calle, número, comuna, ciudad"
          rows={3}
        />
        {errors.direccion && (
          <p className="text-sm text-destructive">{errors.direccion}</p>
        )}
      </div>

      {/* Estado Activo */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-0.5">
          <Label htmlFor="activo">Estado Activo</Label>
          <p className="text-sm text-muted-foreground">
            Define si el contratante está activo en el sistema
          </p>
        </div>
        <Switch
          id="activo"
          checked={formData.activo}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, activo: checked }))
          }
          disabled={loading}
        />
      </div>

      {/* Botones */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="aflow"
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? "Guardando..." : contratante ? "Actualizar" : "Crear Contratante"}
        </Button>
      </div>
    </form>
  );
}
