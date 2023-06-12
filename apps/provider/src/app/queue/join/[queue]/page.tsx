'use client'
import * as Yup from 'yup';
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';
import { apis } from "@/api";
import createForm from "@/components/form";
import { useAuthContext } from "@/contexts/auth.context";


const validationSchema = Yup.object({
  email: Yup.string().email().required(),
  username: Yup.string()
})

export default function Page({ params: { queue } }: { params: { queue: string } }) {
  const [data, setData] = useState<any>(null);
  const router = useRouter();
  const { join_queue } = useAuthContext();

  useEffect(() => {
    if (!data)
      apis.preview_queue(queue)
        .then(e => { console.log(e); setData(e.data); toast(e.message) })
        .catch(e => { console.log(e); toast.error(e.message) })
  }, [data, queue])

  const Form = createForm({
    initialValues: { email: "", username: "" },
    validationSchema
  });

  const submitForm = async (values: any) => {
    try {
      const { message } = await join_queue(queue, values);
      toast(message);
      router.push('/queue/details');
    } catch (error: any) {
      toast(error.message)
      console.log(error);
    }
  }

  return (
    <div className='w-full flex mt-16'>
      {data
        ? (
          <div className='mx-auto'>
            you are about to join: {data.branch.merchant.company_name}'s
            <h2 className="text-4xl">
              {data.name}
            </h2>
            <h3 className='text-gray-400'>
              {data.description}
            </h3>

            <Form submit={submitForm}>
              <div className="mt-[2rem] space-y-[18px]">
                <Form.Input label='Email' required placeholder="Email" type="email" name="email" />
                <Form.Input label='Username' placeholder="Enter a username (optional)" name="username" />
                <Form.Submit text="submit form!" />
              </div>
            </Form>
          </div>
        ) : <div>hmmmm...</div>}
    </div>
  )
}
