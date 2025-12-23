"use client";

import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { deleteProducto } from "../../api/maestroService";
import type { Proveedor, Producto } from "../../types/maestroNegocio";
import { ProductoFormModal } from "./ProductoFormModal";

interface ProductoCRUDSectionProps {
  proveedor: Proveedor;
}

export function ProductoCRUDSection({ proveedor }: ProductoCRUDSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [deletingProducto, setDeletingProducto] = useState<Producto | null>(null);
  
  const queryClient = useQueryClient();

  const productos = proveedor.productos || [];
  
  // Filtrar productos
  const filteredProductos = productos.filter((p) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(search) ||
      p.descripcion.toLowerCase().includes(search) ||
      p.codigo?.toLowerCase().includes(search) ||
      p.categoria?.toLowerCase().includes(search)
    );
  });

  // Mutation para eliminar
  const deleteMutation = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
      toast.success("Producto eliminado exitosamente");
      setDeletingProducto(null);
    },
    onError: (error: Error) => {
      toast.error("Error al eliminar producto", {
        description: error.message,
      });
    },
  });

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto);
    setShowFormModal(true);
  };

  const handleDelete = (producto: Producto) => {
    setDeletingProducto(producto);
  };

  const confirmDelete = () => {
    if (deletingProducto) {
      deleteMutation.mutate(deletingProducto.id);
    }
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setEditingProducto(null);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header con búsqueda y botón crear */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => setShowFormModal(true)}
          className="bg-[#244F82] hover:bg-[#1a3a5f]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-600 font-medium">Total</p>
          <p className="text-2xl font-bold text-blue-700">{productos.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs text-green-600 font-medium">Activos</p>
          <p className="text-2xl font-bold text-green-700">
            {productos.filter((p) => p.estado === "Activo").length}
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-600 font-medium">Inactivos</p>
          <p className="text-2xl font-bold text-gray-700">
            {productos.filter((p) => p.estado === "Inactivo").length}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-xs text-purple-600 font-medium">Categorías</p>
          <p className="text-2xl font-bold text-purple-700">
            {new Set(productos.map((p) => p.categoria).filter(Boolean)).size}
          </p>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="flex-1 border rounded-lg overflow-hidden">
        <ScrollArea className="h-[400px]">
          {filteredProductos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Package className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">
                {searchTerm ? "No se encontraron productos" : "No hay productos registrados"}
              </p>
              <p className="text-sm">
                {searchTerm
                  ? "Intente con otros términos de búsqueda"
                  : "Agregue productos usando el botón superior"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead className="text-right">Valor Interno</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProductos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell className="font-mono text-xs">
                      {producto.codigo || "-"}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{producto.nombre}</p>
                        <p className="text-xs text-gray-500 truncate max-w-xs">
                          {producto.descripcion}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {producto.categoria ? (
                        <Badge variant="outline" className="text-xs">
                          {producto.categoria}
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-xs">Sin categoría</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {producto.unidadMedida}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(producto.valorInterno)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={producto.estado === "Activo" ? "default" : "secondary"}
                        className={
                          producto.estado === "Activo"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : "bg-gray-100 text-gray-800 border-gray-300"
                        }
                      >
                        {producto.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(producto)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(producto)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </div>

      {/* Modal de formulario */}
      <ProductoFormModal
        open={showFormModal}
        onOpenChange={handleCloseForm}
        proveedor={proveedor}
        producto={editingProducto}
      />

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog
        open={!!deletingProducto}
        onOpenChange={(open) => !open && setDeletingProducto(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará el producto:{" "}
              <strong>{deletingProducto?.nombre}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
