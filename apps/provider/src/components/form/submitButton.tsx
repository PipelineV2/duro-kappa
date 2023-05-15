import React from 'react';
import { useFormikContext } from 'formik';
import { Button } from "@/components/button"

type SubmitButtonProps = {
	text?: string
	children?: React.ReactNode
}

export default ({ children, ...props }: SubmitButtonProps) => {
	const { submitForm, isSubmitting } = useFormikContext();

	return (
		<Button
			{...props}
			loading={isSubmitting}
			disabled={isSubmitting}
			onClick={submitForm}
		>
			{children}
		</Button>
	);
}

