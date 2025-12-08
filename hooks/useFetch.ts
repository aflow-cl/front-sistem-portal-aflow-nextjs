"use client";

import { useState, useCallback } from "react";
import type { LoadingState } from "@/types";

interface UseFetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: HeadersInit;
  body?: any;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  state: LoadingState;
  execute: (url: string, options?: UseFetchOptions) => Promise<T | null>;
  reset: () => void;
}

/**
 * Hook genérico para realizar peticiones HTTP
 */
export function useFetch<T = any>(): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<LoadingState>("idle");

  const execute = useCallback(async (url: string, options: UseFetchOptions = {}) => {
    try {
      setState("loading");
      setLoading(true);
      setError(null);

      const { method = "GET", headers = {}, body } = options;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        ...(body && { body: JSON.stringify(body) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      setData(result.data || result);
      setState("success");
      
      return result.data || result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error en la petición";
      setError(errorMessage);
      setState("error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setState("idle");
  }, []);

  return {
    data,
    loading,
    error,
    state,
    execute,
    reset,
  };
}
