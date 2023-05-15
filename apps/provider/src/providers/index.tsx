'use client'

import { AuthProvider } from "@/contexts/auth.context"

export default ({ children }: { children: React.ReactNode }) => {
	return (
		<AuthProvider>
			{children}
		</AuthProvider>
	)
}

