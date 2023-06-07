'use client';

import { createContext, useState, useContext } from 'react';
import { User } from '@/models/auth'
import { apis, LoginMerchant, OnboardMerchant } from '@/api';

export type AuthContextType = {
  user: User;
  onboard: (values: OnboardMerchant) => Promise<string>
  login_merchant: (values: LoginMerchant) => Promise<string>
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState({ username: '', location: '' })
  const onboard = async (values: OnboardMerchant) => {
    return apis.onboard({ body: values });
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
  // check localstorage for token.
  return true;
}

