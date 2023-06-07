'use client'

import * as Yup from 'yup';
import { toast } from 'react-toastify';
import createForm from "@/components/form";
import { AuthContextType, useAuthContext } from '@/contexts/auth.context';
import { OnboardingInputType } from '@/models/auth';

const validationSchema = Yup.object({
	business_name: Yup.string().required(),
	location: Yup.string().required(),
})

function Page() {
	const { onboard }: AuthContextType = useAuthContext();
	const Form = createForm<OnboardingInputType, typeof validationSchema>({
		initialValues: {
			business_name: "",
			location: "",
		},
		validationSchema
	});

	const submitForm = async (values: OnboardingInputType) => {
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
					<Form.Input placeholder="Book of life Inc." name="business_name" />
					<Form.Input placeholder="Paradise" name="location" />
					<Form.Submit text="submit form!" />
				</div>
			</Form>
		</div>
	);
}

export default Page

