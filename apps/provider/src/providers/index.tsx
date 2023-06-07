'use client'

import { AuthProvider } from "@/contexts/auth.context"

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<AuthProvider>
			{children}
		</AuthProvider>
	)
}

export default Providers;
