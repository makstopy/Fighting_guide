import React, { createContext, useContext, ReactNode } from 'react';
import { useCustomCombos, UseCustomCombosReturn } from '../hooks/useCustomCombos';

const CustomCombosContext = createContext<UseCustomCombosReturn | undefined>(undefined);

export function CustomCombosProvider({ children }: { children: ReactNode }) {
  const customCombos = useCustomCombos();
  return (
    <CustomCombosContext.Provider value={customCombos}>
      {children}
    </CustomCombosContext.Provider>
  );
}

export function useCustomCombosContext(): UseCustomCombosReturn {
  const ctx = useContext(CustomCombosContext);
  if (!ctx) throw new Error('useCustomCombosContext must be used within CustomCombosProvider');
  return ctx;
}
