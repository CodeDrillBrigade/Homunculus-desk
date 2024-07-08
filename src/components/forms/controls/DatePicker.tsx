import { Flex, FormControl, FormLabel, Icon, IconButton, LayoutProps, SpaceProps, Text } from '@chakra-ui/react'
import { FormValue } from '../../../models/form/FormValue'
import { FormControls, useFormControl } from '../../../hooks/form-control'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import React from 'react'
import { CalendarDots, X } from '@phosphor-icons/react'

interface DatePickerProps extends LayoutProps, SpaceProps {
	label: string
	defaultValue?: Date
	validator?: (input?: Date) => boolean
	valueConsumer?: (value: FormValue<Date>) => void
	invalidLabel?: string
	controls?: FormControls<Date>
}

export const DatePicker = ({
	label,
	validator,
	defaultValue,
	valueConsumer,
	invalidLabel,
	controls,
	...style
}: DatePickerProps) => {
	const { value, setValue } = useFormControl<Date>({ validator, valueConsumer, defaultValue })
	const innerValue = controls?.value ?? value
	const innerSetValue = controls?.setValue ?? setValue

	return (
		<FormControl {...style}>
			<FormLabel color={value.isValid ? '' : 'crimson'}>{label}</FormLabel>
			<Flex>
				<Icon as={CalendarDots} weight="bold" boxSize={10} mr="0.5em" />
				<SingleDatepicker name="date-input" date={innerValue.value} onDateChange={innerSetValue} />
				{!!innerValue.value && (
					<IconButton
						aria-label="Clear date"
						colorScheme="red"
						icon={<Icon as={X} weight="bold" boxSize={8} />}
						ml="0.5em"
						onClick={() => innerSetValue(undefined)}
					/>
				)}
			</Flex>
			{!innerValue.isValid && !!invalidLabel && (
				<Text fontSize="sm" color="crimson">
					{invalidLabel}
				</Text>
			)}
		</FormControl>
	)
}
