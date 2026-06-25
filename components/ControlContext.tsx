import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ControlType = 'PS' | 'Xbox' | 'Arcade';

interface ControlContextType {
  controlType: ControlType;
  setControlType: (type: ControlType) => void;
}

const ControlContext = createContext<ControlContextType | undefined>(undefined);

export function ControlProvider({ children }: { children: ReactNode }) {
  const [controlType, setControlType] = useState<ControlType>('PS');

  return (
    <ControlContext.Provider value={{ controlType, setControlType }}>
      {children}
    </ControlContext.Provider>
  );
}

export function useControl() {
  const context = useContext(ControlContext);
  if (context === undefined) {
    throw new Error('useControl must be used within a ControlProvider');
  }
  return context;
}
