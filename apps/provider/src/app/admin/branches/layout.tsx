'use client'
import Layout from '@/components/layouts/dashboard';
import Branches from './branches'
import Link from 'next/link';
import { Button } from '@/components/button';
import { useScreenContext } from '@/contexts/screen.context';

function Page({ children }: {
  children: React.ReactNode
}) {
  const { is_mobile } = useScreenContext();

  return (
    <Layout
      jumbotronText='here are your branches...'
      jumbotronCta={(
        <div className='flex justify-between items-end w-full'>
          <Link href="/admin/branches" className={is_mobile() ? "block" : "hidden"}>go back</Link>
          <Link href={`/admin/branches/create`}>
            <Button> create new branch </Button>
          </Link>
        </ div>
      )}
      Left={<Branches />}
    >
      {children}
    </Layout>
  );
}

export default Page

