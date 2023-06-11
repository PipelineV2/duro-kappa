import React from "react"
import { Field, FieldProps } from "formik"

export type InputProps = { label?: string } & React.InputHTMLAttributes<HTMLInputElement>

const Input = ({ label, name, ...props }: InputProps) => {
  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <div className="flex flex-col space-y-1">
          {label && (
            <label>
              {label}
              {props.required && <span className="ml-1 text-red-600">*</span>}
            </label>
          )}
          <input required={!!props.required} id={name} className="_rounded focus:outline-black focus:ring-0 focus:ring-black border-black border px-3 py-2" {...props} {...field} />
          <div data-input-error={name} className={meta.error ? "px-3 py-1 rounded block text-xs bg-red-100 text-red-500" : "hidden"}>
            {meta.error}
          </div>
        </div>
      )}
    </Field>
  )
}

export default Input;
