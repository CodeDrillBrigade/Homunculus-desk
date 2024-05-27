import {Center, FormControl, FormLabel, LayoutProps, Select, SpaceProps, Text} from "@chakra-ui/react";
import {FormValue} from "../../../models/form/FormValue";
import React, {useState} from "react";

export interface SelectOption<T> {
	name: string;
	value: T;
	id?: string;
}

interface SelectInputProps<T> extends SpaceProps, LayoutProps {
	label: string,
	placeholder: string,
	values: SelectOption<T>[],
	validator?: (input?: SelectOption<T>) => boolean;
	valueConsumer?: (value: FormValue<T>) => void;
	invalidLabel?: string;
}

export function SelectInput<T>({label, placeholder, values, validator, valueConsumer, invalidLabel, ...style}: SelectInputProps<T>) {
	const [value, setValue] = useState<FormValue<T>>({
		value: undefined,
		isValid: true,
	});

	const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedId = event.target.selectedOptions[0]?.id;
		const selectedOption = values.find(it => !!it.id ? it.id === selectedId : it.name === selectedId)
		if(!!selectedOption) {
			const newValue = {
				value: selectedOption.value,
				isValid: !validator || validator(selectedOption),
			};
			setValue(newValue);
			if (!!valueConsumer) {
				valueConsumer(newValue);
			}
		}
	}

	return (<FormControl {...style}>
		<FormLabel color={value.isValid ? "" : "crimson"}>{label}</FormLabel>
		<Select onChange={onSelectChange}>
			{values.map( (it, idx) => <option key={`select-${label}-${idx}`} id={it.id ?? it.name}>{it.name}</option>)}
		</Select>
		{!value.isValid && !!invalidLabel && <Center><Text fontSize='md' color="crimson">{invalidLabel}</Text></Center>}
	</FormControl>)
}