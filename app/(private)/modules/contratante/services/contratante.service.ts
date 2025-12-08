import { appLogger } from "@/core/logging/logger";
import { generateId } from "@/lib/utils";
import type { Contratante, ContratanteFormData } from "../types/contratante";
import mockContratantes from "../mock/contratantes.json";

/**
 * Servicio para gestión de Contratantes (Mock)
 */
let contratantes: Contratante[] = [...mockContratantes] as Contratante[];

export const contratanteService = {
  /**
   * Obtener todos los contratantes
   */
  async getAll(): Promise<Contratante[]> {
    try {
      appLogger.db("Get all contratantes", "contratantes");
      
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      return [...contratantes];
    } catch (error) {
      appLogger.error("Get all contratantes error", error);
      throw error;
    }
  },

  /**
   * Obtener un contratante por ID
   */
  async getById(id: string): Promise<Contratante | null> {
    try {
      appLogger.db("Get contratante by ID", "contratantes", { id });
      
      await new Promise((resolve) => setTimeout(resolve, 200));
      
      const contratante = contratantes.find((c) => c.id === id);
      return contratante || null;
    } catch (error) {
      appLogger.error("Get contratante by ID error", error);
      throw error;
    }
  },

  /**
   * Crear un nuevo contratante
   */
  async create(data: ContratanteFormData): Promise<Contratante> {
    try {
      appLogger.db("Create contratante", "contratantes", data);
      
      const newContratante: Contratante = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await new Promise((resolve) => setTimeout(resolve, 400));
      
      contratantes.push(newContratante);
      
      appLogger.db("Contratante created", "contratantes", { id: newContratante.id });
      
      return newContratante;
    } catch (error) {
      appLogger.error("Create contratante error", error);
      throw error;
    }
  },

  /**
   * Actualizar un contratante existente
   */
  async update(id: string, data: Partial<ContratanteFormData>): Promise<Contratante | null> {
    try {
      appLogger.db("Update contratante", "contratantes", { id, ...data });
      
      const index = contratantes.findIndex((c) => c.id === id);
      
      if (index === -1) {
        return null;
      }
      
      await new Promise((resolve) => setTimeout(resolve, 400));
      
      contratantes[index] = {
        ...contratantes[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      appLogger.db("Contratante updated", "contratantes", { id });
      
      return contratantes[index];
    } catch (error) {
      appLogger.error("Update contratante error", error);
      throw error;
    }
  },

  /**
   * Eliminar un contratante
   */
  async delete(id: string): Promise<boolean> {
    try {
      appLogger.db("Delete contratante", "contratantes", { id });
      
      const index = contratantes.findIndex((c) => c.id === id);
      
      if (index === -1) {
        return false;
      }
      
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      contratantes.splice(index, 1);
      
      appLogger.db("Contratante deleted", "contratantes", { id });
      
      return true;
    } catch (error) {
      appLogger.error("Delete contratante error", error);
      throw error;
    }
  },

  /**
   * Buscar contratantes
   */
  async search(query: string): Promise<Contratante[]> {
    try {
      appLogger.db("Search contratantes", "contratantes", { query });
      
      await new Promise((resolve) => setTimeout(resolve, 250));
      
      const lowerQuery = query.toLowerCase();
      
      const results = contratantes.filter((c) => {
        const searchText = `${c.nombreCompleto || c.razonSocial} ${c.rut} ${c.correo}`.toLowerCase();
        return searchText.includes(lowerQuery);
      });
      
      return results;
    } catch (error) {
      appLogger.error("Search contratantes error", error);
      throw error;
    }
  },
};
