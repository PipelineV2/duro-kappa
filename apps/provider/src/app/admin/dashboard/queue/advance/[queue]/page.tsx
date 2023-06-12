'use client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useQueueContext } from '@/contexts/queue.context';
import Dialog from '@/components/dialog';
import { useRequestContext } from '@/contexts/request.context';
import { Button } from '@/components/button';

export default function Page({ params: { queue } }: { params: { queue: string } }) {
  const { list_admin_queues } = useQueueContext();
  const { apis, loading } = useRequestContext();
  const router = useRouter();

  const advance_queue = async () => {
    try {
      const { message } = await apis.advance_queue({ queueId: Number.parseInt(queue) });
      await list_admin_queues();
      toast.success(message);
      router.push(`/admin/dashboard/queue/${queue}`)
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <Dialog
      id="advance-queue"
      confirmComponent={() => (
        <Button onClick={advance_queue}>
          {loading ? 'loading...' : 'confirm'}
        </Button>)}
    >
      you're about to call the next person from the queue..
    </Dialog>
  )
}
