"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Building2, Mail, Phone, AlertCircle } from "lucide-react";
import { formatRut } from "@/lib/utils";

import { ContratanteFormValues } from "./ContratanteModal";

interface ContratanteFormProps {
    form: UseFormReturn<ContratanteFormValues>;
    onSubmit: (data: ContratanteFormValues) => void;
    isSubmitting?: boolean;
}

export function ContratanteForm({ form, onSubmit, isSubmitting }: ContratanteFormProps) {
    const watchTipoPersona = form.watch("tipoPersona");

    const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatRut(e.target.value);
        form.setValue("rut", formatted);
    };

    return (
        <form id="contratante-form" onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={isSubmitting} className="space-y-4 sm:space-y-6 pr-2 border-0 min-w-0">
                {/* Info de selección de tipo */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs sm:text-sm text-blue-700">
                            Selecciona el tipo de contratante para mostrar los campos correspondientes
                        </p>
                    </div>
                </div>

                {/* Tipo de Persona (seleccionable) y Estado */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                    {/* Tipo de Persona */}
                    <FormField
                        control={form.control}
                        name="tipoPersona"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">Tipo:</span>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-fit border-0 p-0 h-auto focus:ring-0">
                                            <SelectValue>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        field.value === "persona-natural"
                                                            ? "bg-purple-50 text-purple-700 border-purple-200 px-3 py-2 cursor-pointer"
                                                            : "bg-orange-50 text-orange-700 border-orange-200 px-3 py-2 cursor-pointer"
                                                    }
                                                >
                                                    {field.value === "persona-natural" ? (
                                                        <><User className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" /> Persona Natural</>
                                                    ) : (
                                                        <><Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" /> Empresa</>
                                                    )}
                                                </Badge>
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="persona-natural">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    Persona Natural
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="empresa">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4" />
                                                    Empresa
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormMessage className="text-xs sm:text-sm" />
                            </FormItem>
                        )}
                    />

                    {/* Estado */}
                    <FormField
                        control={form.control}
                        name="estado"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">Estado:</span>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-fit border-0 p-0 h-auto focus:ring-0">
                                            <SelectValue>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        field.value === "Activo"
                                                            ? "bg-green-50 text-green-700 border-green-200 px-3 py-2 cursor-pointer"
                                                            : "bg-gray-50 text-gray-700 border-gray-200 px-3 py-2 cursor-pointer"
                                                    }
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={`w-2 h-2 rounded-full ${field.value === "Activo" ? "bg-green-500" : "bg-gray-400"}`}></div>
                                                        {field.value}
                                                    </div>
                                                </Badge>
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Activo">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                    Activo
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Inactivo">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                                    Inactivo
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormMessage className="text-xs sm:text-sm" />
                            </FormItem>
                        )}
                    />
                </div>

                <Separator />

                {/* Campos condicionales según tipo */}
                {watchTipoPersona === "persona-natural" ? (
                    <div className="space-y-3 sm:space-y-4">
                        {/* RUT */}
                        <FormField
                            control={form.control}
                            name="rut"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs sm:text-sm">RUT *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="12.345.678-9"
                                            onChange={handleRutChange}
                                            maxLength={12}
                                            className="text-sm sm:text-base"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs sm:text-sm" />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <FormField
                                control={form.control}
                                name="primerNombre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs sm:text-sm">Primer Nombre *</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Juan" className="text-sm sm:text-base" />
                                        </FormControl>
                                        <FormMessage className="text-xs sm:text-sm" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="segundoNombre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs sm:text-sm">Segundo Nombre</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Carlos" className="text-sm sm:text-base" />
                                        </FormControl>
                                        <FormMessage className="text-xs sm:text-sm" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <FormField
                                control={form.control}
                                name="apellidoPaterno"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs sm:text-sm">Apellido Paterno *</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Pérez" className="text-sm sm:text-base" />
                                        </FormControl>
                                        <FormMessage className="text-xs sm:text-sm" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="apellidoMaterno"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs sm:text-sm">Apellido Materno</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="González" className="text-sm sm:text-base" />
                                        </FormControl>
                                        <FormMessage className="text-xs sm:text-sm" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        {/* RUT y Razón Social en la misma línea */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <FormField
                                control={form.control}
                                name="rut"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs sm:text-sm">RUT *</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="12.345.678-9"
                                                onChange={handleRutChange}
                                                maxLength={12}
                                                className="text-sm sm:text-base"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs sm:text-sm" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="razonSocial"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs sm:text-sm">Razón Social *</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Empresa Ejemplo SpA" className="text-sm sm:text-base" />
                                        </FormControl>
                                        <FormMessage className="text-xs sm:text-sm" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="giro"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs sm:text-sm">Giro Comercial *</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Construcción y Servicios" className="text-sm sm:text-base" />
                                    </FormControl>
                                    <FormMessage className="text-xs sm:text-sm" />
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                <Separator />

                {/* Contacto */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Email *</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="contacto@ejemplo.cl"
                                            className="pl-9 text-sm sm:text-base"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs sm:text-sm" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="telefono"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Teléfono *</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            {...field}
                                            placeholder="+56 9 1234 5678"
                                            className="pl-9 text-sm sm:text-base"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs sm:text-sm" />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Notas */}
                <FormField
                    control={form.control}
                    name="notas"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs sm:text-sm">Notas (opcional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Información adicional sobre el contratante..."
                                    rows={3}
                                    className="text-sm sm:text-base resize-none"
                                />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                    )}
                />
            </fieldset>
        </form>
    );
}
