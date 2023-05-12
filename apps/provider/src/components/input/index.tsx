'use client'

import React from "react"
import { Field, FieldProps } from "formik"

export const Input = ({ name, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
	return (
		<Field name={name}>
			{({ field, meta }: FieldProps) => (
				<div>
					<input {...props} {...field} />
					{meta.error}
				</div>
			)}
		</Field>
	)
}
