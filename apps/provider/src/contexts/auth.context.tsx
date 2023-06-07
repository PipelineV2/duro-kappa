'use client';

import { createContext, useState, useContext } from 'react';
import { User } from '@/models/auth'
import { apis, LoginMerchant, OnboardMerchant } from '@/api';

export type AuthContextType = {
  user: User;
  onboard: (values: OnboardMerchant) => Promise<UIResponse>
  login_merchant: (values: LoginMerchant) => Promise<UIResponse>
}

type UIResponse = {
  message: string
}

const DURO_USER = 'duro_user'
const TOKEN = 'duro_user'

class Storage {
  set(key: string, value: string) {
    localStorage.setItem(key, value)
  }

  get(key: string) {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : null;
  }

  getMultiple(keys: Array<string>) {
    return keys.map(key => this.get(key))
  }
}

const storage = new Storage();
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState({
    user: storage.get(DURO_USER),
    token: storage.get(TOKEN)
  })

  const onboard = async (values: OnboardMerchant): Promise<UIResponse> => {
    try {
      const { status, message, data } = await apis.onboard({ body: values });
      if (!status) throw new Error(message);

      storage.set(TOKEN, data.token);
      storage.set(DURO_USER, data.user);
      setUser({ ...data })
      return { message };
    } catch (error: any) {
      console.log(error);
      throw new Error(`Could not sign you up: ${error.message}`)
    }
  }

  const login_merchant = async (body: LoginMerchant) => {
    return apis.login_merchant({ body })
  }


  return (
    <AuthContext.Provider value={{
      user,
      login_merchant,
      onboard
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const AuthContext = createContext({} as AuthContextType);

export const useAuthContext = () => useContext(AuthContext);

export const is_user_logged_in = async () => {
  return storage.get(TOKEN) && storage.get(DURO_USER);
}

