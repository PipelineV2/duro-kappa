import React from 'react';
import { Formik, FormikHelpers, FormikValues } from 'formik';
import SubmitButton from "./submitButton"
import Input from './input';

export type FormSetupProps<T, V> = {
  initialValues: T & FormikValues
  validationSchema: V
}

export type FormProps<T> = {
  children: React.ReactNode,
  submit: (values: T) => Promise<any> | void
}

export type FormSetup<T> = {
  (props: FormProps<T>): React.ReactElement
} & {
  Input: typeof Input
  Submit: typeof SubmitButton
}

export default function createForm<T, V>({ initialValues, validationSchema }: FormSetupProps<T, V>): FormSetup<T> {
  function Wrapper({ children, submit }: FormProps<T>): React.ReactElement {
    const onSubmit = (values: T & FormikValues, helpers: FormikHelpers<T & FormikValues>) => {
      submit(values)
        ?.finally(() => {
          helpers.setSubmitting(false);
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

