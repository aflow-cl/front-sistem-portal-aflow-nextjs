import { useState, useEffect } from "react";
import { regionesChile, Region, Ciudad } from "@/app/portal/presupuesto/crear/data/regionesChile";
import type { UseFormReturn } from "react-hook-form";

interface UseChileanRegionsProps<T extends Record<string, unknown>> {
  form: UseFormReturn<T>;
  regionFieldName?: string;
  ciudadFieldName?: string;
  comunaFieldName?: string;
}

export const useChileanRegions = <T extends Record<string, unknown>>({
  form,
  regionFieldName = "regionId",
  ciudadFieldName = "ciudadId",
  comunaFieldName = "comuna",
}: UseChileanRegionsProps<T>) => {
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState<Ciudad[]>([]);
  const [comunasDisponibles, setComunasDisponibles] = useState<string[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const watchRegionId = form.watch(regionFieldName as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const watchCiudadId = form.watch(ciudadFieldName as any);

  // Update available cities when region changes
  useEffect(() => {
    if (watchRegionId) {
      const region = regionesChile.find(
        (r: Region) => r.id.toString() === watchRegionId
      );
      if (region) {
        setCiudadesDisponibles(region.ciudades);

        // Reset city and commune if current city doesn't exist in new region
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentCiudadId = form.getValues(ciudadFieldName as any);
        const ciudadExiste = region.ciudades.some(
          (c: Ciudad) => c.id.toString() === currentCiudadId
        );

        if (!ciudadExiste) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          form.setValue(ciudadFieldName as any, "" as any);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          form.setValue(comunaFieldName as any, "" as any);
          setComunasDisponibles([]);
        }
      }
    } else {
      setCiudadesDisponibles([]);
      setComunasDisponibles([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.setValue(ciudadFieldName as any, "" as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.setValue(comunaFieldName as any, "" as any);
    }
  }, [watchRegionId, form, ciudadFieldName, comunaFieldName]);

  // Update available communes when city changes
  useEffect(() => {
    if (watchCiudadId && ciudadesDisponibles.length > 0) {
      const ciudad = ciudadesDisponibles.find(
        (c) => c.id.toString() === watchCiudadId
      );
      if (ciudad) {
        setComunasDisponibles(ciudad.comunas);

        // Reset commune if current commune doesn't exist in new city
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentComuna = form.getValues(comunaFieldName as any) as string;
        const comunaExiste = ciudad.comunas.includes(currentComuna);

        if (!comunaExiste) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          form.setValue(comunaFieldName as any, "" as any);
        }
      }
    } else {
      setComunasDisponibles([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.setValue(comunaFieldName as any, "" as any);
    }
  }, [watchCiudadId, ciudadesDisponibles, form, comunaFieldName]);

  return {
    regiones: regionesChile,
    ciudadesDisponibles,
    comunasDisponibles,
    watchRegionId,
    watchCiudadId,
  };
};
