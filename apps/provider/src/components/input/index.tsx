'use client'

import React from "react"
import { Field, FieldProps } from "formik"

export const Input = ({ name, ...props }: React.InputHTMLAttributes<React.HTMLInputTypeAttribute>) => {
	return (
		<Field name={name}>
			{({ field, meta }: FieldProps) => (
				<div>
					<input name={name} {...props} {...field} />
					{meta.error}
				</div>
			)}
		</Field>
	)
}
