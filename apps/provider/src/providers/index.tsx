'use client'

import { AuthProvider } from "@/contexts/auth.context"
import { QueueProvider } from "@/contexts/queue.context"
import { ModalProvider } from "@/contexts/modal.context"
import { BranchProvider } from "@/contexts/branch.context"
import { RequestProvider } from "@/contexts/request.context"

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <RequestProvider>
      <ModalProvider>
        <AuthProvider>
          <BranchProvider>
            <QueueProvider>
              {children}
            </QueueProvider>
          </BranchProvider>
        </AuthProvider>
      </ModalProvider>
    </RequestProvider>
  )
}

export default Providers;
