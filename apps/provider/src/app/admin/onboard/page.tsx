'use client'

import * as Yup from 'yup';
import { toast } from 'react-toastify';
import createForm from "@/components/form";
import { AuthContextType, useAuthContext } from '@/contexts/auth.context';
import { OnboardMerchant } from '@/api';
import { useRouter } from 'next/navigation';

const validationSchema = Yup.object({
  company_name: Yup.string().required(),
  location: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string().required(),
})

function Page() {
  const { onboard }: AuthContextType = useAuthContext();
  const router = useRouter();
  const Form = createForm<OnboardMerchant, typeof validationSchema>({
    initialValues: {
      company_name: "",
      location: "",
      coordinates: "",
      username: "",
      email: "",
      password: ""
    },
    validationSchema
  });

  const submitForm = async (values: OnboardMerchant) => {
    try {
      //toast.success("you have been successfully onboarded.")
      const { message } = await onboard(values);
      toast.success(message);
      router.push('/admin/dashboard')
    } catch (error) {
      toast.error("you encountered an error while onboarding... please try again or contact support.")
    }
  }

  return (
    <div className="w-[20rem] h-max mx-auto mt-[2rem] md:mt-[5rem]">
      <Form submit={submitForm}>
        <div className="flex flex-col space-y-[18px]">
          <Form.Input required label='company name' placeholder="vault industries." name="company_name" />
          <Form.Input required label="location" placeholder="undisclosed" name="location" />
          <Form.Input required label='username' placeholder="homelander" name="username" />
          <Form.Input required label='email' placeholder="homee.hates.every1@aol.com" type="email" name="email" />
          <Form.Input required label='password' placeholder="****" type='password' name="password" />
          <Form.Submit text="submit form!" className='ml-auto' />
        </div>
      </Form>
    </div>
  );
}

export default Page

