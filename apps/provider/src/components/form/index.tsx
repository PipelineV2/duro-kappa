'use client'

import React from 'react';
import { Formik, FormikHelpers, FormikValues, useFormikContext } from 'formik';
import SubmitButton from "./submitButton"
import Input from './input';

type FormSetupProps<T, V> = {
	initialValues: T & FormikValues
	validationSchema: V
}

type FormProps<T> = {
	children: React.ReactNode,
	submit: (values: T) => Promise<any>
}

export default function createForm<T, V>({ initialValues, validationSchema }: FormSetupProps<T, V>) {
	function Wrapper({ children, submit }: FormProps<T>) {
		const onSubmit = (values: T & FormikValues, helpers: FormikHelpers<T & FormikValues>) => {
			submit(values)
				.finally(() => {
					// i'm using this settimeout to simulate an async reply
					setTimeout(() => {
						console.log('asfd')
						helpers.setSubmitting(false);
					}, 3000)
				})
		}

		return (
			<Formik
				onSubmit={onSubmit}
				initialValues={initialValues}
				validationSchema={validationSchema}
			>
				{children}
			</Formik>
		)
	}

	Wrapper.Input = Input;

	Wrapper.Submit = SubmitButton;

	return Wrapper;
}

