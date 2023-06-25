'use client'

import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { LoginMerchant } from '@/api';
import createForm from "@/components/form";
import { AuthContextType, useAuthContext } from '@/contexts/auth.context';

const validationSchema = Yup.object({
  email: Yup.string().required(),
  password: Yup.string().required(),
})

function Page() {
  const router = useRouter();
  const { login_merchant }: AuthContextType = useAuthContext();
  const Form = createForm<LoginMerchant, typeof validationSchema>({
    initialValues: { email: "", password: "" },
    validationSchema
  });

  const submitForm = async (values: LoginMerchant) => {
    try {
      const { message } = await login_merchant(values);
      toast.success(message);
      router.push('/admin/dashboard');
    } catch (error: any) {
      console.log(error);
      toast.error(error.message)
    }
  }

  return (
    <div className="w-[20rem] h-max mx-auto mt-[2rem] md:mt-[5rem]">
      <Form submit={submitForm}>
        <div className="flex flex-col space-y-[18px]">
          <Form.Input required aria-label='Email' label="Email" placeholder="Email" type="email" name="email" />
          <Form.Input required label="Password" aria-label='Password' placeholder="Enter a password" type='password' name="password" />
          <Form.Submit text="submit form!" className="ml-auto" />
        </div>
      </Form>
    </div>
  );
}

export default Page

