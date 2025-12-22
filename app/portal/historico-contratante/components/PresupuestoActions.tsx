/**
 * Componente de menú de acciones para cada presupuesto
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, FileText, Download, Link2, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { PresupuestoHistorico } from "../types/historico";
import { downloadPresupuestoDocument, copyShareLink } from "../api/historicoService";

interface PresupuestoActionsProps {
  presupuesto: PresupuestoHistorico;
  onView?: (presupuesto: PresupuestoHistorico) => void;
}

export const PresupuestoActions = ({
  presupuesto,
  onView,
}: PresupuestoActionsProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleView = () => {
    if (onView) {
      onView(presupuesto);
    } else {
      toast.info(`Ver detalles de ${presupuesto.folio}`);
    }
  };

  const handleViewDocument = () => {
    if (presupuesto.documentoUrl) {
      // Abrir en nueva pestaña
      window.open(presupuesto.documentoUrl, "_blank");
      toast.success("Documento abierto en nueva pestaña");
    } else {
      toast.error("No hay documento disponible");
    }
  };

  const handleDownload = async () => {
    if (!presupuesto.documentoUrl) {
      toast.error("No hay documento disponible para descargar");
      return;
    }

    setIsDownloading(true);
    try {
      await downloadPresupuestoDocument(presupuesto);
      toast.success(`Documento ${presupuesto.folio} descargado exitosamente`);
    } catch (error) {
      toast.error("Error al descargar el documento");
      console.error("Error downloading:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await copyShareLink(presupuesto);
      toast.success("Link copiado al portapapeles");
    } catch (error) {
      toast.error("Error al copiar el link");
      console.error("Error copying link:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          Ver Detalles
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleViewDocument}
          disabled={!presupuesto.documentoUrl}
        >
          <FileText className="mr-2 h-4 w-4" />
          Ver Documento
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDownload}
          disabled={!presupuesto.documentoUrl || isDownloading}
        >
          <Download className="mr-2 h-4 w-4" />
          {isDownloading ? "Descargando..." : "Descargar Documento"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleCopyLink}
          disabled={!presupuesto.linkCompartir}
        >
          <Link2 className="mr-2 h-4 w-4" />
          Copiar Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
