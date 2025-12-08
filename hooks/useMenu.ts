"use client";

import { useState, useEffect } from "react";
import type { MenuItem, MenuGroup } from "@/types";
import { API_ROUTES } from "@/lib/constants";

/**
 * Hook para obtener el menú dinámico basado en el rol del usuario
 */
export function useMenu() {
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_ROUTES.MENU);
      
      if (!response.ok) {
        throw new Error("Error al obtener el menú");
      }

      const data = await response.json();
      
      if (data.success) {
        setMenuGroups(data.data.groups || []);
        setMenuItems(data.data.items || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el menú");
    } finally {
      setLoading(false);
    }
  };

  return {
    menuGroups,
    menuItems,
    loading,
    error,
    refetch: fetchMenu,
  };
}
