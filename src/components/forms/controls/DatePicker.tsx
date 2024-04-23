import { FormControl, FormLabel, Input, LayoutProps, SpaceProps, Text } from '@chakra-ui/react'
import { FormValue } from '../../../models/form/FormValue'
import { useFormControl } from '../../../hooks/form-control'
import React from 'react'

interface DatePickerProps extends LayoutProps, SpaceProps {
	label: string
	initialDate?: Date
	validator?: (input?: Date) => boolean
	valueConsumer?: (value: FormValue<Date>) => void
	invalidLabel?: string
}

export const DatePicker = ({
	label,
	initialDate,
	validator,
	valueConsumer,
	invalidLabel,
	...style
}: DatePickerProps) => {
	const { value, setValue } = useFormControl<Date>({ validator, valueConsumer })

	const handleDateChange = () => {
		console.log('here')
	}

	return (
		<FormControl {...style}>
			<FormLabel color={value.isValid ? '' : 'crimson'}>{label}</FormLabel>
			<Input
				placeholder="Select Date and Time"
				size="md"
				type="datetime-local"
				onChange={e => console.log('Date changed:', e.target.value)}
			/>
			{!value.isValid && !!invalidLabel && (
				<Text fontSize="sm" color="crimson">
					{invalidLabel}
				</Text>
			)}
		</FormControl>
	)
}
