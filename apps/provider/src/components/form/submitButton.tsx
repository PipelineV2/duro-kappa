import React from 'react';
import { useFormikContext } from 'formik';
import { Button, ButtonProps } from "@/components/button"

const SubmitButton = ({ children, ...props }: ButtonProps) => {
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

