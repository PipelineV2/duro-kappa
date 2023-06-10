'use client'
import Queues from './queues'
import Link from 'next/link';
import { Button } from '@/components/button';
import Layout from '@/components/layouts/dashboard';
import { ModalTrigger } from '@/components/modal';

function Page({ children }: {
  children: React.ReactNode
}) {
  return (
    <Layout
      jumbotronText='here are your queues...'
      jumbotronCta={(
        <ModalTrigger id="create-queue">
          <Link href={`/admin/dashboard/queue/create`}>
            <Button> create new queue </Button>
          </Link>
        </ModalTrigger>
      )}
      Left={<Queues />}
    >
      {children}
    </Layout>
  );
}

export default Page

