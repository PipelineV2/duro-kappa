import { useQueueContext } from '@/contexts/queue.context';
import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@/components/button';
import toast from 'react-hot-toast';
import { useAuthContext } from '@/contexts/auth.context';

export default function Page() {
  const { list_admin_queues, meta } = useQueueContext();

  useEffect(() => {
    if (!meta)
      list_admin_queues()
    //.then(({ message }) => toast(message))
    //.catch(({ message }) => toast(message))
  }, [meta, list_admin_queues])

  return (
    <div className="hidden lg:block">
      {meta
        ? (
          <div className='mt-2'>
            {meta?.map((queue: any) => (
              <div className='mb-8 p-4 border border border-black shadow-outset '>
                <Link className='' key={queue.id} href={`/admin/dashboard/queue/${queue.id}`}>
                  <div>
                    <div className='text-xl'>{queue.name}</div>
                    <span className='text-sm'>{queue.description}</span>
                  </div>
                  <span>{queue.users.length} occupants. </span>
                  <div className='w-full text-right'>
                    <a className='text-sm text-gray-700 hover:underline' href={queue.qr_code} target='_blank'>view qr code</a>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div>
            you may not be authorized to see this page.
          </div>)}
    </div>
  );
}
