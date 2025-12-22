/**
 * Layout del módulo Histórico de Contratantes
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Histórico de Contratantes | Portal Aflow",
  description: "Visualiza y gestiona el histórico completo de presupuestos de contratantes",
};

export default function HistoricoContratanteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {children}
    </div>
  );
}
