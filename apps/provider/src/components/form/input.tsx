import React from "react"
import { Field, FieldProps } from "formik"

const Input = ({ name, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
	return (
		<Field name={name}>
			{({ field, meta }: FieldProps) => (
				<div className="flex flex-col space-y-1">
					<input className="rounded focus:outline-black focus:ring-0 focus:ring-black border-black border px-3 py-2" {...props} {...field} />
					<div data-input-error={name} className={meta.error ? "px-3 py-1 rounded block text-xs bg-red-100 text-red-500" : "hidden"}>
						{meta.error}
					</div>
				</div>
			)}
		</Field>
	)
}

export default Input;
