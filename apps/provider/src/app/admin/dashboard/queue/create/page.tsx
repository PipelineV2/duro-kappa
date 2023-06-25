'use client';
import Modal from '@/components/modal';
import { Button } from '@/components/button';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import createForm from "@/components/form";
import { CreateQueueInput, apis } from '@/api';
import { useModalContext } from '@/contexts/modal.context';
import { useQueueContext } from '@/contexts/queue.context';

const validationSchema = Yup.object({
  name: Yup.string().required(),
  description: Yup.string().required(),
})

export default function Page() {
  const { toggle } = useModalContext();
  const { list_admin_queues } = useQueueContext();
  const router = useRouter();

  const Form = createForm<CreateQueueInput, typeof validationSchema>({
    initialValues: { name: "", description: "" },
    validationSchema
  });

  const submitForm = async (values: CreateQueueInput) => {
    try {
      const { message } = await apis.create_queue(values);
      await list_admin_queues();
      toast.success(message);
      router.push('/admin/dashboard')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <Modal
      onClose={() => { router.back() }}
      defaultOpen={true}
      id="create-queue"
      as={() => (
        <div className='w-[20rem] p-5'>
          <div className='text-2xl pb-5 '> create a new queue </div>
          <Form submit={submitForm}>
            <div className="space-y-[18px]">
              <Form.Input placeholder="enter a name for the queue" name="name" />
              <Form.Input placeholder="enter a description" name="description" />
              <div className='grid grid-cols-2 gap-5 mt-2'>
                <Form.Submit text="submit form!" />
                <Button onClick={() => toggle("create-queue")}>
                  go back
                </Button>
              </div>
            </div>
          </Form>
        </div>
      )}
    />
  )
}
