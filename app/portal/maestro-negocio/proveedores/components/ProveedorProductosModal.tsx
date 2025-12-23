"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Package, Tag, DollarSign, BarChart3, Box } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Proveedor } from "../../types/maestroNegocio";
import { getDisplayName, ESTADO_CONFIG } from "../../types/maestroNegocio";

interface ProveedorProductosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proveedor: Proveedor | null;
}

export function ProveedorProductosModal({
  open,
  onOpenChange,
  proveedor,
}: ProveedorProductosModalProps) {
  if (!proveedor) return null;

  const productos = proveedor.productos || [];
  const productosActivos = productos.filter((p) => p.estado === "Activo");
  const productosInactivos = productos.filter((p) => p.estado === "Inactivo");

  // Categorías únicas
  const categorias = [...new Set(productos.map((p) => p.categoria).filter(Boolean))];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-3">
            <Package className="w-6 h-6 text-[#244F82]" />
            Catálogo de Productos - {getDisplayName(proveedor)}
          </DialogTitle>
        </DialogHeader>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Productos</p>
                  <p className="text-2xl font-bold text-[#244F82]">{productos.length}</p>
                </div>
                <Box className="w-8 h-8 text-[#244F82] opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Activos</p>
                  <p className="text-2xl font-bold text-green-600">{productosActivos.length}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Categorías</p>
                  <p className="text-2xl font-bold text-purple-600">{categorias.length}</p>
                </div>
                <Tag className="w-8 h-8 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Products List */}
        <ScrollArea className="flex-1 pr-4">
          {productos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sin Productos Registrados
              </h3>
              <p className="text-sm text-gray-500">
                Este proveedor aún no tiene productos en su catálogo
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {productos.map((producto) => {
                const estadoConfig = ESTADO_CONFIG[producto.estado];
                
                return (
                  <Card key={producto.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">
                              {producto.nombre}
                            </h4>
                            <Badge className={estadoConfig.badgeClass}>
                              {estadoConfig.label}
                            </Badge>
                          </div>
                          
                          {producto.codigo && (
                            <p className="text-xs text-gray-500 font-mono mb-2">
                              SKU: {producto.codigo}
                            </p>
                          )}
                          
                          <p className="text-sm text-gray-600 mb-3">
                            {producto.descripcion}
                          </p>
                        </div>

                        <div className="text-right ml-4">
                          <div className="flex items-center gap-1 text-[#244F82] mb-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-xl font-bold">
                              {formatCurrency(producto.valorInterno)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            por {producto.unidadMedida}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-3 border-t">
                        {producto.categoria && (
                          <div className="flex items-center gap-1.5">
                            <Tag className="w-4 h-4 text-gray-400" />
                            <Badge variant="secondary" className="text-xs">
                              {producto.categoria}
                            </Badge>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <span>Unidad: {producto.unidadMedida}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer Summary */}
        {productos.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex gap-4">
                <span className="text-gray-600">
                  <span className="font-semibold text-green-600">{productosActivos.length}</span> activos
                </span>
                {productosInactivos.length > 0 && (
                  <span className="text-gray-600">
                    <span className="font-semibold text-gray-500">{productosInactivos.length}</span> inactivos
                  </span>
                )}
              </div>
              
              {categorias.length > 0 && (
                <div className="flex gap-1.5 items-center">
                  <span className="text-gray-600">Categorías:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {categorias.slice(0, 3).map((cat) => (
                      <Badge key={cat} variant="outline" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                    {categorias.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{categorias.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
