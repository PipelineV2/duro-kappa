'use client'
import React, { createContext, useContext, useState } from 'react';

export type ModalContextType = {
  id: string | null;
  toggle: (id: string, value?: boolean) => void;
  active: boolean;
  close: () => void
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);
  const [id, setId] = useState<string | null>(null);

  const close = () => {
    setActive(false);
    setId(null);
  };

  const toggle = (id: string, value?: boolean): void => {
    setId(id);
    setActive(e => value ?? !e)
  };

  return (
    <ModalContext.Provider value={{ id, toggle, active, close }}>
      {children}
    </ModalContext.Provider>
  )
}

const ModalContext = createContext({} as ModalContextType);

export const useModalContext = () => useContext(ModalContext);

