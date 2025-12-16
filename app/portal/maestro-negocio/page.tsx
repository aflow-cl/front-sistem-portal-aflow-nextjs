"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MaestroNegocioPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir automáticamente a la primera sección (Contratantes)
    router.replace("/portal/maestro-negocio/contratantes");
  }, [router]);

  return null;
}
