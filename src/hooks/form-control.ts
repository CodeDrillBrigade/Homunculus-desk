import { FormValue } from '../models/form/FormValue'
import { useCallback, useState } from 'react'

export interface FormControls<T> {
	value: FormValue<T>
	setValue: (value: T | undefined) => void
	validator?: (value: T | undefined) => boolean
	valueConsumer?: (value: FormValue<T>) => void
	resetValue: () => void
}

interface FormControlParams<T> {
	defaultValue?: T
	validator?: (value: T | undefined) => boolean
	valueConsumer?: (value: FormValue<T>) => void
}

export function useFormControl<T>({ defaultValue, validator, valueConsumer }: FormControlParams<T>): FormControls<T> {
	const [formValue, setFormValue] = useState<FormValue<T>>({
		value: defaultValue,
		isValid: true,
	})

	const setValue = useCallback(
		(value: T | undefined) => {
			const newValue = {
				value: value,
				isValid: !validator || validator(value),
			}
			setFormValue(newValue)
			if (!!valueConsumer) {
				valueConsumer(newValue)
			}
		},
		[validator, valueConsumer]
	)

	const resetValue = useCallback(() => {
		const newValue = {
			value: defaultValue,
			isValid: true,
		}
		setFormValue(newValue)
		if (!!valueConsumer) {
			valueConsumer(newValue)
		}
	}, [defaultValue, valueConsumer])

	return { value: formValue, setValue, validator, valueConsumer, resetValue }
}
