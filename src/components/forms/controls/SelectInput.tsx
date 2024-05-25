import { FormControl, FormLabel, LayoutProps, Select, SpaceProps, Text } from '@chakra-ui/react'
import { FormValue } from '../../../models/form/FormValue'
import React from 'react'
import { FormControls, useFormControl } from '../../../hooks/form-control'

export interface SelectOption<T> {
	name: string
	value: T
	id?: string
}

interface SelectInputProps<T> extends SpaceProps, LayoutProps {
	label: string
	placeholder: string
	values: SelectOption<T>[]
	validator?: (input?: SelectOption<T>) => boolean
	valueConsumer?: (value: FormValue<SelectOption<T>>) => void
	invalidLabel?: string
	controls?: FormControls<SelectOption<T>>
	defaultValue?: T
}

export function SelectInput<T>({
	label,
	placeholder,
	values,
	validator,
	valueConsumer,
	invalidLabel,
	controls,
	defaultValue,
	...style
}: SelectInputProps<T>) {
	const { value: innerValue, setValue: innerSetValue } = useFormControl<SelectOption<T>>({
		defaultValue: values.find(it => it.value === defaultValue),
		validator,
		valueConsumer,
	})
	const value = controls?.value ?? innerValue
	const setValue = controls?.setValue ?? innerSetValue

	const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedId = event.target.selectedOptions[0]?.id
		const selectedOption = values.find(it => (!!it.id ? it.id === selectedId : it.name === selectedId))
		if (!!selectedOption) {
			setValue(selectedOption)
		}
	}

	return (
		<FormControl {...style}>
			<FormLabel color={value.isValid ? '' : 'crimson'}>{label}</FormLabel>
			<Select onChange={onSelectChange} defaultValue={value.value?.id}>
				{values.map((it, idx) => (
					<option key={`select-${label}-${idx}`} id={it.id ?? it.name}>
						{it.name}
					</option>
				))}
			</Select>
			{!value.isValid && !!invalidLabel && (
				<Text fontSize="sm" color="crimson">
					{invalidLabel}
				</Text>
			)}
		</FormControl>
	)
}
