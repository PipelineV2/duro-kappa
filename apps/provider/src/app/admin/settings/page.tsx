'use client'

import * as Yup from 'yup';
import { toast } from 'react-toastify';
import createForm from "@/components/form";
import { AuthContextType, useAuthContext } from '@/contexts/auth.context';
import { OnboardingInputType } from '@/models/auth';
import { LoginMerchant, OnboardMerchant } from '@/api';

const validationSchema = Yup.object({
  email: Yup.string().required(),
  password: Yup.string().required(),
})

function Page() {
  const { login_merchant }: AuthContextType = useAuthContext();
  const Form = createForm<LoginMerchant, typeof validationSchema>({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema
  });

  const submitForm = async (values: LoginMerchant) => {
    try {
      toast.success("you have been successfully onboarded.")
      return await login_merchant(values);
    } catch (error) {
      console.log(error);
      toast.error("you encountered an error while onboarding... please try again or contact support.")
    }
  }

  return (
    <div className="w-[10rem] h-max mx-auto mt-[2rem]">
      <Form submit={submitForm}>
        <div className="space-y-[18px]">
          <Form.Input placeholder="Email" type="email" name="email" />
          <Form.Input placeholder="Enter a password" type='password' name="password" />
          <Form.Submit text="submit form!" />
        </div>
      </Form>
    </div>
  );
}

export default Page

