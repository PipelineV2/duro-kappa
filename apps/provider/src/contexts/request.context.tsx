import React, { createContext, useContext, useState } from 'react';
import { apis as _apis } from '@/api';

export type RequestContextType = {
  apis: any,
  loading: boolean
}
type ApiFunctionType = {
  (...args: any[]): Promise<any>
}

export function RequestProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);

  const apis = Object.entries(_apis).reduce((acc, [key, fn]: [key: string, fn: ApiFunctionType]) => {
    return {
      ...acc,
      [key]: async function(...args: any[]) {
        try {
          setLoading(true);
          return fn(...args)
        } catch (error: any) {
          throw new Error(error.messagee);
        } finally {
          setLoading(false);
        }
      }
    }
  }, {})

  return (
    <RequestContext.Provider value={{ apis, loading }}>
      {children}
    </RequestContext.Provider>
  )
}

const RequestContext = createContext({} as RequestContextType);

export const useRequestContext = () => useContext(RequestContext);
