'use client'
import Link from 'next/link';
import { useQueueContext } from '@/contexts/queue.context';
import { apis } from '@/api';
import toast from 'react-hot-toast';

export default function Queue({ queue: _queue }: { queue: string }) {
  const { meta, list_admin_queues } = useQueueContext();
  const queue = meta?.find((e: any) => e.id == _queue)
  const currently_attending = queue?.users
    ?.filter((e: any) => e.attending_to) ?? []
  const remainder_on_queue = queue?.users
    ?.filter((e: any) => !e.attending_to) ?? []

  const dismiss_user = async (id: string) => {
    try {
      await apis.dismiss_user(id)
      await list_admin_queues();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const _advance_queue = async (user: string) => {
    try {
      const { message } = await apis.advance_queue({
        userId: Number.parseInt(user),
        queueId: Number.parseInt(_queue)
      });
      await list_admin_queues();
      toast.success(message);
    } catch (error: any) {
      toast.error(error.message);
    }
  }
  return (
    <div className="">
      {meta
        ? (
          <div>
            <div className='text-5xl'> {queue.name} </div>
            <div className='text-lg mt-1'>
              <span className='text-bold'> </span> {queue.description}
            </div>

            <div className='mt-8'>
              <div className='text-right text-lg underline'> queue actions </div>
              <div>
                <div className="text-right flex gap-5 w-full justify-end mb-5">
                  {remainder_on_queue.length > 0 &&
                    <Link className="hover:line-through cursor-pointer" href={`/admin/dashboard/queue/advance/${queue.id}`}>
                      advance queue
                    </Link>}

                  {meta.length > 1 && queue.users.length == 0 &&
                    <Link className="hover:line-through cursor-pointer" href={`/admin/dashboard/queue/delete/${queue.id}`}>
                      delete queue
                    </Link>}
                </div>
              </div>
            </div>

            <div className='mt-14'>
              <div className='text-lg underline-offset-4 underline'> you're currently attending to: ({currently_attending.length}) </div>
              <div className='mt-1'>
                {currently_attending
                  .map((user: any) => (
                    <div className='flex items-center relative justify-between py-4 px-1 ' key={user.id}>
                      <div>
                        - {user.name ?? user.email}
                      </div>

                      <div className='group flex items-center absolute right-0'>
                        <div className='group-hover:block mr-2 hidden border relative flex flex-col top-[2rem] bg-white'>
                          <div onClick={() => dismiss_user(user.id)} className='cursor-pointer py-2 px-3 hover:bg-black hover:text-white'>
                            dismiss user.
                          </div>
                          <div onClick={() => _advance_queue(user.id)} className='cursor-pointer py-2 px-3 hover:bg-black hover:text-white'>
                            dismiss user & advance queue.
                          </div>
                        </div>

                        <div className='cursor-pointer'>
                          (more options)
                        </div>
                      </div>
                    </div>))}
              </div>
            </div>

            <div className='mt-8'>
              <div className='text-lg underline-offset-4 underline'> remaining queue occupants ({remainder_on_queue.length}) </div>
              <span></span>
              <div className='mt-1'>
                {remainder_on_queue
                  .map((user: any) => (
                    <div className='flex items-center relative justify-between py-4 px-1 ' key={user.id}>
                      <span>
                        - {user.name ?? user.email}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            hmmm... you may not be authorized to view this page atm.
          </div>)}
    </div>
  );
}
