import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apis as _apis } from '@/api';

export type ScreenSize = "desktop" | "mobile" | "tablet";

export type ScreenContextType = {
  is_mobile: () => boolean,
  is_tablet: () => boolean,
  is_desktop: () => boolean,
  get_screen_size: () => ScreenSize,
  screen_size: number
}

const _window: any = typeof window !== "undefined" ? window : {};
export function ScreenProvider({ children }: { children: React.ReactNode }) {
  const [screen_size, setScreenSize] = useState(_window.innerWidth);

  useEffect(() => {
    const resizer = () => {
      setScreenSize(_window.innerWidth)
    }

    addEventListener('resize', resizer);
    return () => removeEventListener('resize', resizer);
  }, [setScreenSize])

  const is_mobile = useCallback(() => {
    return screen_size <= 640;
  }, [screen_size])

  const is_tablet = useCallback(() => {
    return screen_size > 640 && screen_size <= 1024;
  }, [screen_size])

  const is_desktop = useCallback(() => {
    return screen_size > 1024;
  }, [screen_size])

  const get_screen_size = useCallback((): ScreenSize => {
    return "desktop";
  }, [screen_size])

  return (
    <ScreenContext.Provider value={{ screen_size, is_mobile, is_tablet, is_desktop, get_screen_size }}>
      {children}
    </ScreenContext.Provider>
  )
}

const ScreenContext = createContext({} as ScreenContextType);

export const useScreenContext = () => useContext(ScreenContext);

