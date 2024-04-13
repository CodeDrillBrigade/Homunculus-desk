import {Button, FormControl, FormLabel, HStack, Input, LayoutProps, SpaceProps, useNumberInput, Text} from "@chakra-ui/react";
import {FormValue} from "../../../models/form/FormValue";

interface NumberInputProps extends LayoutProps, SpaceProps {
	label: string;
	defaultValue?: number;
	min?: number;
	max?: number;
	step?: number;
	precision?: number;
	validator?: (input?: number) => boolean;
	valueConsumer?: (value: FormValue<number>) => void;
	invalidLabel?: string;
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
	...style
}: NumberInputProps) => {
	const {
		getInputProps,
		getIncrementButtonProps,
		getDecrementButtonProps,
		valueAsNumber
	} = useNumberInput({
		step, min, max, precision, defaultValue,
		onChange: (_: string, valueAsNumber: number) => {
			if (!!valueConsumer) {
				valueConsumer({ value: valueAsNumber, isValid: !validator || validator(valueAsNumber) });
			}
		},
		onInvalid: (_: string, _value: string, valueAsNumber: number) => {
			if(!!valueConsumer && !!min && valueAsNumber < min) {
				valueConsumer({ value: min, isValid: !validator || validator(valueAsNumber) });
			} else if(!!valueConsumer && !!max && valueAsNumber > max) {
				valueConsumer({ value: max, isValid: !validator || validator(valueAsNumber) });
			}
		}
	});

	const isValid = !validator || validator(valueAsNumber);

	const inc = getIncrementButtonProps();
	const dec = getDecrementButtonProps();
	const input = getInputProps();
	return (<FormControl {...style}>
		<FormLabel color={isValid ? "" : "crimson"}>{label}</FormLabel>
		<HStack>
			<Button {...dec}>-</Button>
			<Input
				{...input}
				borderColor={isValid ? "" : "crimson"}
				borderWidth={isValid ? "" : "2px"}
			/>
			<Button {...inc}>+</Button>
			{!isValid && !!invalidLabel && <Text fontSize='sm' color="crimson">{invalidLabel}</Text>}
		</HStack>
	</FormControl>)
}