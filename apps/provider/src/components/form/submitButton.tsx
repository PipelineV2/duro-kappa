import React from 'react';
import { useFormikContext } from 'formik';
import { Button } from "@/components/button"
import { defaultMaxListeners } from 'events';

type SubmitButtonProps = {
	text?: string
	children?: React.ReactNode
}

const SubmitButton = ({ children, ...props }: SubmitButtonProps) => {
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

export default SubmitButton;

