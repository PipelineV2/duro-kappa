'use client'
import Queues from './queues'
import Link from 'next/link';
import { Button } from '@/components/button';
import Layout from '@/components/layouts/dashboard';
import { ModalTrigger } from '@/components/modal';
import { useScreenContext } from '@/contexts/screen.context';

function Page({ children }: {
  children: React.ReactNode
}) {
  const { is_mobile } = useScreenContext();

  return (
    <Layout
      jumbotronText='here are your queues...'
      jumbotronCta={(
        <div className='flex justify-between items-end w-full'>
          <Link href="/admin/branches" className={is_mobile() ? "block" : "hidden"}>go back</Link>
          <ModalTrigger id="create-queue">
            <Link href={`/admin/dashboard/queue/create`}>
              <Button> create new queue </Button>
            </Link>
          </ModalTrigger>
        </div>
      )}
      Left={<Queues />}
    >
      {children}
    </Layout>
  );
}

export default Page

