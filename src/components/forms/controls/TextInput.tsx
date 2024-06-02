import { FormControl, FormLabel, Input, LayoutProps, SpaceProps, Text } from '@chakra-ui/react'
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
	isPassword?: boolean
}

export const TextInput = ({
	label,
	placeholder,
	validator,
	valueConsumer,
	invalidLabel,
	controls,
	isPassword,
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
			<FormLabel color={innerValue.isValid ? '' : 'red'}>{label}</FormLabel>
			<Input
				type={!!isPassword ? 'password' : 'test'}
				placeholder={placeholder}
				borderColor={innerValue.isValid ? '' : 'red'}
				borderWidth={innerValue.isValid ? '' : '2px'}
				value={innerValue.value ?? ''}
				onChange={handleChange}
			/>
			{!innerValue.isValid && !!invalidLabel && (
				<Text fontSize="sm" color="red">
					{invalidLabel}
				</Text>
			)}
		</FormControl>
	)
}
