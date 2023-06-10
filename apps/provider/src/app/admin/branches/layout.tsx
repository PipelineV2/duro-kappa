'use client'
import Layout from '@/components/layouts/dashboard';
import Branches from './branches'
import Link from 'next/link';
import { Button } from '@/components/button';

function Page({ children }: {
  children: React.ReactNode
}) {
  return (
    <Layout
      jumbotronText='here are your branches...'
      jumbotronCta={(
        <Link href={`/admin/branches/create`}>
          <Button> create branch </Button>
        </Link>
      )}
      Left={<Branches />}
    >
      {children}
    </Layout>
  );
}

export default Page

