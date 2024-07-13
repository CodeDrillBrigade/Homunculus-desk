import {
	Button,
	FormControl,
	FormLabel,
	HStack,
	Input,
	LayoutProps,
	SpaceProps,
	useNumberInput,
	Text,
} from '@chakra-ui/react'
import { FormValue } from '../../../models/form/FormValue'
import { FormControls, useFormControl } from '../../../hooks/form-control'

interface NumberInputProps extends LayoutProps, SpaceProps {
	label: string
	defaultValue?: number
	min?: number
	max?: number
	step?: number
	precision?: number
	validator?: (input?: number) => boolean
	valueConsumer?: (value: FormValue<number>) => void
	controls?: FormControls<number>
	invalidLabel?: string
}

export const NumberInput = ({
	label,
	defaultValue,
	min,
	max,
	step,
	precision,
	validator,
	valueConsumer,
	invalidLabel,
	controls,
	...style
}: NumberInputProps) => {
	const { value, setValue } = useFormControl<number>({ validator, valueConsumer, defaultValue })
	const innerValue = controls?.value ?? value
	const innerSetValue = controls?.setValue ?? setValue
	const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
		step,
		min,
		max,
		precision,
		defaultValue: controls?.value?.value ?? defaultValue,
		onChange: (_: string, valueAsNumber: number) => innerSetValue(valueAsNumber),
		onInvalid: (_: string, _value: string, valueAsNumber: number) => {
			if (!!valueConsumer && !!min && valueAsNumber < min) {
				innerSetValue(min)
			} else if (!!valueConsumer && !!max && valueAsNumber > max) {
				innerSetValue(max)
			}
		},
	})

	const inc = getIncrementButtonProps()
	const dec = getDecrementButtonProps()
	const input = getInputProps()
	return (
		<FormControl {...style}>
			<FormLabel color={innerValue.isValid ? '' : 'red'}>{label}</FormLabel>
			<HStack>
				<Button {...dec}>-</Button>
				<Input
					{...input}
					borderColor={innerValue.isValid ? '' : 'red'}
					borderWidth={innerValue.isValid ? '' : '2px'}
				/>
				<Button {...inc}>+</Button>
			</HStack>
			{!innerValue.isValid && !!invalidLabel && (
				<Text fontSize="sm" color="red" mt="0.5em">
					{invalidLabel}
				</Text>
			)}
		</FormControl>
	)
}
