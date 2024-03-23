import {FormControl, FormLabel, SpaceProps, Text, Textarea} from "@chakra-ui/react";
import { FormValue } from "../../../models/form/FormValue";
import React, { useState } from "react";

interface TextAreaProps extends SpaceProps{
	label: string;
	placeholder: string;
	validator?: (input?: string) => boolean;
	valueConsumer?: (value: FormValue<string>) => void;
	invalidLabel?: string;
}

export const TextArea = ({
	label,
	placeholder,
	validator,
	valueConsumer,
	invalidLabel,
	...style
}: TextAreaProps) => {
	const [value, setValue] = useState<FormValue<string>>({
		value: undefined,
		isValid: true,
	});

	const handleChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
		const input = event.currentTarget.value.trim();
		const newValue = {
			value: input,
			isValid: !validator || validator(input),
		};
		setValue(newValue);
		if (!!valueConsumer) {
			valueConsumer(newValue);
		}
	};

	return (
		<FormControl {...style} >
			<FormLabel color={value.isValid ? "" : "crimson"}>{label}</FormLabel>
			<Textarea
				placeholder={placeholder}
				borderColor={value.isValid ? "" : "crimson"}
				borderWidth={value.isValid ? "" : "2px"}
				onChange={handleChange}
			/>
			{!value.isValid && !!invalidLabel && <Text fontSize='sm' color="crimson">{invalidLabel}</Text>}
		</FormControl>
	);
};