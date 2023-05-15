'use client';

import { createContext, useState, useContext } from 'react';
import { User, LoginInputType, OnboardingInputType } from '@/models/auth'

export type AuthContextType = {
	user: User;
	login: (values: LoginInputType) => Promise<string>
	onboard: (values: OnboardingInputType) => Promise<string>
}

export const AuthContext = createContext({
	user: {},
	login: (values: LoginInputType) => { },
	onboard: (values: OnboardingInputType) => { }
} as AuthContextType);


export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState({ username: '', location: '' })
	const login = async (values: LoginInputType) => {
		console.log(values)
		return "me";
	}
	const onboard = async (values: OnboardingInputType) => {
		// throw new Error('adf')
		console.log(values);
		return "me";
	}

	return (
		<AuthContext.Provider value={{
			user,
			login,
			onboard
		}}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuthContext = () => useContext(AuthContext);

