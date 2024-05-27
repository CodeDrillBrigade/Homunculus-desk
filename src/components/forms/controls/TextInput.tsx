import {
	FormControl,
	FormLabel,
	Input,
	LayoutProps,
	SpaceProps,
	Text
} from '@chakra-ui/react'
import { FormValue } from '../../../models/form/FormValue'
import React from 'react'
import { FormControls, useFormControl } from '../../../hooks/form-control'

interface TextInputProps extends LayoutProps, SpaceProps {
	label: string
	placeholder: string
	validator?: (input?: string) => boolean
	valueConsumer?: (value: FormValue<string>) => void
	invalidLabel?: string
	controls?: FormControls<string>
}

export const TextInput = ({
	label,
	placeholder,
	validator,
	valueConsumer,
	invalidLabel,
	controls,
	...style
}: TextInputProps) => {
	const { value, setValue } = useFormControl<string>({ validator, valueConsumer })
	const innerValue = controls?.value ?? value
	const innerSetValue = controls?.setValue ?? setValue

	const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
		const input = event.currentTarget.value
		innerSetValue(input)
	}

	return (
		<FormControl {...style}>
			<FormLabel color={innerValue.isValid ? '' : 'crimson'}>{label}</FormLabel>
			<Input
				placeholder={placeholder}
				borderColor={innerValue.isValid ? '' : 'crimson'}
				borderWidth={innerValue.isValid ? '' : '2px'}
				value={innerValue.value ?? ''}
				onChange={handleChange}
			/>
			{!innerValue.isValid && !!invalidLabel && (
				<Text fontSize="sm" color="crimson">
					{invalidLabel}
				</Text>
			)}
		</FormControl>
	)
}
