'use client';
import Modal from '@/components/modal';
import { Button } from '@/components/button';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import createForm from "@/components/form";
import { CreateBranchInput, apis } from '@/api';
import { useBranchContext } from '@/contexts/branch.context';
import { useModalContext } from '@/contexts/modal.context';

const validationSchema = Yup.object({
  email: Yup.string().required(),
  password: Yup.string().required(),
  name: Yup.string().required(),
  description: Yup.string().required(),
  coordinates: Yup.string()
})

export default function Page() {
  const { get_branches } = useBranchContext();
  const { toggle } = useModalContext();
  const router = useRouter();

  const Form = createForm<CreateBranchInput, typeof validationSchema>({
    initialValues: { email: "", password: "", username: "", coordinates: "", location: "" },
    validationSchema
  });

  const submitForm = async (values: CreateBranchInput) => {
    try {
      const { message } = await apis.create_branch(values);
      await get_branches();
      toast.success(message);
    } catch (error: any) {
      console.log(error);
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
          <div className='text-2xl pb-5 '> create a new branch </div>
          <Form submit={submitForm}>
            <div className="space-y-[18px]">
              <Form.Input placeholder="enter a location" name="location" />
              <Form.Input placeholder="enter a username" name="username" />
              <Form.Input placeholder="enter an email" type="email" name="email" />
              <Form.Input placeholder="enter a password" type='password' name="password" />
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
