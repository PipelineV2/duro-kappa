'use client'

import * as Yup from 'yup';
import { toast } from 'react-toastify';
import createForm from "@/components/form";
import { AuthContextType, useAuthContext } from '@/contexts/auth.context';
import { OnboardingInputType } from '@/models/auth';
import { OnboardMerchant } from '@/api';

const validationSchema = Yup.object({
  company_name: Yup.string().required(),
  location: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string().required(),
})

function Page() {
  const { onboard }: AuthContextType = useAuthContext();
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
      toast.success("you have been successfully onboarded.")
      return await onboard(values);
    } catch (error) {
      console.log(error);
      toast.error("you encountered an error while onboarding... please try again or contact support.")
    }
  }

  return (
    <div className="w-[10rem] h-max mx-auto mt-[2rem]">
      <Form submit={submitForm}>
        <div className="space-y-[18px]">
          <Form.Input placeholder="Company Name" name="company_name" />
          <Form.Input placeholder="Location" name="location" />
          <Form.Input placeholder="Username" name="username" />
          <Form.Input placeholder="Email" type="email" name="email" />
          <Form.Input placeholder="Enter a password" type='password' name="password" />
          <Form.Submit text="submit form!" />
        </div>
      </Form>
    </div>
  );
}

export default Page

