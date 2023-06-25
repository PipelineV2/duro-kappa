'use client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useQueueContext } from '@/contexts/queue.context';
import Dialog from '@/components/dialog';
import { useRequestContext } from '@/contexts/request.context';
import { Button } from '@/components/button';

export default function Page({ params: { queue } }: { params: { queue: string } }) {
  const { list_admin_queues } = useQueueContext();
  const router = useRouter();
  const { apis, loading } = useRequestContext();

  const delete_queue = async () => {
    try {
      const { message } = await apis.delete_queue(Number.parseInt(queue));
      await list_admin_queues();
      toast.success(message);
      router.push(`/admin/dashboard`)
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <Dialog
      id="delete-queue"
      confirmComponent={() => (
        <Button onClick={delete_queue}>
          {loading ? 'loading...' : 'confirm'}
        </Button>)}
    >
      you're about to delete this queue.. <br />
      do you want to continue?
    </Dialog>
  )
}
