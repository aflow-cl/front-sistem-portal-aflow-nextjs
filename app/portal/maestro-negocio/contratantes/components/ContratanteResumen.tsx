"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, User, Building2, MapPin, Plus, X } from "lucide-react";

import { ContratanteFormValues } from "./ContratanteModal";
import { SucursalFormValues } from "./SucursalForm";

interface ContratanteResumenProps {
    contratante: ContratanteFormValues | null;
    sucursal: SucursalFormValues | null;
    onClose: () => void;
    onCreateNew: () => void;
}

export function ContratanteResumen({
    contratante,
    sucursal,
    onClose,
    onCreateNew,
}: ContratanteResumenProps) {
    if (!contratante) return null;

    const isPersonaNatural = contratante.tipoPersona === "persona-natural";
    const nombre = isPersonaNatural
        ? `${contratante.primerNombre} ${contratante.apellidoPaterno}`
        : contratante.razonSocial;

    return (
        <div className="flex flex-col items-center justify-center py-8 space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>

            <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">¡Contratante Creado!</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    El contratante y su sucursal principal han sido registrados exitosamente en el sistema.
                </p>
            </div>

            <div className="w-full max-w-md bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-4">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                        {isPersonaNatural ? (
                            <User className="w-5 h-5 text-[#244F82]" />
                        ) : (
                            <Building2 className="w-5 h-5 text-[#244F82]" />
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">{nombre}</p>
                        <p className="text-xs text-gray-500">{contratante.rut}</p>
                        <p className="text-xs text-gray-500 mt-1">{contratante.email}</p>
                    </div>
                </div>

                {sucursal && (
                    <>
                        <div className="h-px bg-gray-200 w-full" />
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                                <MapPin className="w-5 h-5 text-[#FF7A00]" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{sucursal.nombre}</p>
                                <p className="text-xs text-gray-500">
                                    {sucursal.calle} {sucursal.numero}
                                    {sucursal.complemento ? `, ${sucursal.complemento}` : ""}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {sucursal.comuna}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-4">
                <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                >
                    <X className="w-4 h-4 mr-2" />
                    Cerrar
                </Button>
                <Button
                    onClick={onCreateNew}
                    className="flex-1 bg-[#244F82] hover:bg-[#1a3a5f]"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Otro
                </Button>
            </div>
        </div>
    );
}
