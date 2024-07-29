import { FormValue } from '../models/form/FormValue'
import { useCallback, useState } from 'react'

type FormValueDispatcher<T> = (currentValue: T | undefined) => T

export interface FormControls<T> {
	value: FormValue<T>
	setValue: (value: T | undefined | FormValueDispatcher<T>) => void
	resetValue: (isValid?: boolean) => void
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
		(value: T | undefined | FormValueDispatcher<T>) => {
			setFormValue(currentValue => {
				let computedValue: T | undefined
				if (typeof value === 'function') {
					const dispatcher = value as FormValueDispatcher<T>
					computedValue = dispatcher(currentValue.value)
				} else {
					computedValue = value as T | undefined
				}

				const newValue = {
					value: computedValue,
					isValid: !validator || validator(computedValue),
				}
				if (!!valueConsumer) {
					valueConsumer(newValue)
				}
				return newValue
			})
		},
		[validator, valueConsumer]
	)

	const resetValue = useCallback(
		(isValid?: boolean) => {
			const newValue = {
				value: defaultValue,
				isValid: isValid ?? true,
			}
			setFormValue(newValue)
			if (!!valueConsumer) {
				valueConsumer(newValue)
			}
		},
		[defaultValue, valueConsumer]
	)

	return { value: formValue, setValue, resetValue }
}
