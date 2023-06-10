'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { apis, JoinQueueInput, LoginMerchant, OnboardMerchant } from '@/api';
import { Storage, is_client, DURO_USER, TOKEN } from "@/utils/utils"
import { User } from '@/models/auth'


const storage = new Storage();
export type UIResponse = { message: string }
export type AuthContextType = {
  user: User;
  onboard: (values: OnboardMerchant) => Promise<UIResponse>
  login_merchant: (values: LoginMerchant) => Promise<UIResponse>
  logout: () => void
  join_queue: (queue: string, opts: JoinQueueInput) => Promise<UIResponse>
}

type AuthStateType = Record<"user" | "token", any>;
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthStateType>(() => ({
    user: storage.get(DURO_USER),
    token: storage.get(TOKEN)
  }))

  const auth_pages = [
    { path: '/admin', user: 'admin', exclude: ['/admin/login', '/admin/onboard'] },
    { path: '/admin/branches', user: 'super_admin' },
    { path: '/queue/details', user: 'client' }
  ]

  useEffect(() => {
    const found = auth_pages.find(({ path }) => pathname.startsWith(path))
    if (found) {
      if (found.exclude) {
        const exclude = found.exclude.find(e => e == pathname);
        if (exclude) return;
      }
      if (!user.user || !user.token)
        return router.push('/');

      switch (found.user) {
        case 'admin':
          if (is_client(user.user))
            return router.push('/queue/details');
          break;

        default:
          break;
      }
    }
  }, [pathname]);

  const onboard = async (values: OnboardMerchant): Promise<UIResponse> => {
    try {
      const { message, data } = await apis.onboard({ body: values });
      update_user(data);
      return { message };
    } catch (error: any) {
      console.log(error);
      throw new Error(`Could not sign you up: ${error.message}`)
    }
  }

  const update_user = (data: AuthStateType) => {
    if (data.token === null || data.user === null) {
      storage.clear();
      setUser({ ...data })
    } else {
      storage.set(TOKEN, data.token);
      storage.set(DURO_USER, data.user);
      setUser({ ...data })
    }
  }

  const login_merchant = async (body: LoginMerchant) => {
    try {
      const { message, data } = await apis.login_merchant({ body })
      update_user(data)
      return { message }
    } catch (error: any) {
      console.log(error);
      throw new Error(`Could not log you in: ${error.message}`)
    }
  }

  const join_queue = async (queue: string, opts: JoinQueueInput) => {
    try {
      const { message, data } = await apis.join_queue(queue, opts)
      update_user(data);
      return { message }
    } catch (error: any) {
      throw error;
    }
  }

  const logout = () => {
    try {
      update_user({ token: null, user: null })
      router.push('/')
    } catch (error: any) {
      //
    }
  };

  return (
    <AuthContext.Provider value={{
      user: user.user,
      login_merchant,
      logout,
      onboard,
      join_queue
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

