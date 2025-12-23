"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BudgetSettings } from '@/types/presupuesto';

interface BudgetSettingsContextType {
  settings: BudgetSettings;
  updateSettings: (newSettings: Partial<BudgetSettings>) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

const DEFAULT_SETTINGS: BudgetSettings = {
  folioOperativo: 'PRE',
  folioEstilo: 'Simple',
  folioColorFondo: '#f3f4f6',
  tipoLetra: 'Arial',
  tamanoLetra: 'Normal',
  tamanoLogo: 100,
  colorCabeceraGrilla: '#244F82',
  datosCabecera: '',
};

const STORAGE_KEY = 'aflow-budget-settings';

const BudgetSettingsContext = createContext<BudgetSettingsContextType | undefined>(undefined);

export function BudgetSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BudgetSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as BudgetSettings;
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.error('Error loading budget settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save settings to localStorage whenever they change
  const updateSettings = (newSettings: Partial<BudgetSettings>) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        ...newSettings,
        updatedAt: new Date().toISOString(),
      };
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving budget settings:', error);
      }
      
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error resetting budget settings:', error);
    }
  };

  return (
    <BudgetSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        isLoading,
      }}
    >
      {children}
    </BudgetSettingsContext.Provider>
  );
}

export function useBudgetSettings() {
  const context = useContext(BudgetSettingsContext);
  if (context === undefined) {
    throw new Error('useBudgetSettings must be used within a BudgetSettingsProvider');
  }
  return context;
}
