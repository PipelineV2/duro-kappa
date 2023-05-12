import React, { ComponentType } from 'react';
import { Formik, FormikValues, useFormikContext } from 'formik';
import { Button } from "@/components/button"

type SubmitButtonProps = {
	text?: string
	children?: React.ReactNode
}

type FormSetupProps<T, V> = {
	initialValues: T & FormikValues
	validationSchema: V
}

type FormProps<T> = {
	children: React.ReactNode,
	submit: (values: T) => void
}

export default function createForm<T, V>({ initialValues, validationSchema }: FormSetupProps<T, V>) {
	function Wrapper({ children, submit }: FormProps<T>) {
		return (
			<Formik
				initialValues={initialValues}
				onSubmit={submit}
				validationSchema={validationSchema}
			>
				{children}
			</Formik>
		)
	}

	Wrapper.Submit = ({ text, children }: SubmitButtonProps) => {
		const { submitForm } = useFormikContext();

		return (
			<Button onClick={() => submitForm()}>
				{children ?? text ?? "Submit"}
			</Button>
		);
	}

	return Wrapper;
}

