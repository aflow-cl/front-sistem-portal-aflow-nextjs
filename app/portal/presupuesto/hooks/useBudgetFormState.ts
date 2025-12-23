"use client";

import { UseFormReturn } from 'react-hook-form';
import { useEffect, useState } from 'react';

/**
 * Hook to share form state between the wizard and preview panel
 * Watches all form values and provides reactive updates
 */
export function useBudgetFormState<T extends Record<string, unknown>>(
  form: UseFormReturn<T>
) {
  const [formValues, setFormValues] = useState<T>(form.getValues());

  useEffect(() => {
    const subscription = form.watch((data) => {
      setFormValues(data as T);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return {
    formValues,
    form,
    // Utility to get specific field value
    getFieldValue: <K extends keyof T>(field: K): T[K] => formValues[field],
    // Check if form has any values
    hasData: Object.values(formValues).some(val => 
      val !== undefined && val !== null && val !== ''
    ),
  };
}

/**
 * Hook to calculate budget totals in real-time
 */
export function useBudgetCalculations(items: Array<Record<string, unknown>> = []) {
  const [totals, setTotals] = useState({
    subtotal: 0,
    ivaTotal: 0,
    totalGeneral: 0,
    itemCount: 0,
  });

  useEffect(() => {
    const validItems = items.filter(item => !item.esComentario);
    
    const subtotal = validItems.reduce((sum, item) => {
      const cantidad = Number(item.cantidad) || 0;
      const valor = Number(item.valor) || 0;
      const utilidad = Number(item.utilidad) || 0;
      
      const valorConUtilidad = valor * (1 + utilidad / 100);
      return sum + (cantidad * valorConUtilidad);
    }, 0);

    const ivaTotal = validItems.reduce((sum, item) => {
      const cantidad = Number(item.cantidad) || 0;
      const valor = Number(item.valor) || 0;
      const utilidad = Number(item.utilidad) || 0;
      const iva = Number(item.iva) || 0;
      
      const valorConUtilidad = valor * (1 + utilidad / 100);
      const bruto = cantidad * valorConUtilidad;
      return sum + (bruto * iva / 100);
    }, 0);

    const totalGeneral = subtotal + ivaTotal;

    setTotals({
      subtotal,
      ivaTotal,
      totalGeneral,
      itemCount: validItems.length,
    });
  }, [items]);

  return totals;
}
