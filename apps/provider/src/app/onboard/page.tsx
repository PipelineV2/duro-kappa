'use client'

import * as Yup from 'yup';
import { Input } from "@/components/input";
import createForm from "@/components/form";

const validationSchema = Yup.object({
	business_nam: Yup.string(),
	location: Yup.string(),
	//  closing_time: Yup.string()
})

function Page() {
	type Values = {
		business_name: string
		location: string
	}
	const initialValues: Values = {
		business_name: "",
		location: "",
		// closing_time: ""
	};
	const Form = createForm<Values, typeof validationSchema>({ initialValues, validationSchema })

	const submitForm = (values: Values) => {
		console.log(values);
	}

	return (
		<div>
			<Form submit={submitForm}>
				<div>
					<Input name="business_name" />
					<Input name="location" />
					{/* <Input name="closing_time" /> */}

					<Form.Submit>
						submit form
					</Form.Submit>
				</div>
			</Form>
		</div>
	);
}

export default Page

