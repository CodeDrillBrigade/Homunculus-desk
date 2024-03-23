import { FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { FormValue } from "../../../models/form/FormValue";
import React, { useState } from "react";

type TextInputProps = {
    label: string;
    placeholder: string;
    validator?: (input?: string) => boolean;
    valueConsumer?: (value: FormValue<string>) => void;
    invalidLabel?: string;
};

export const TextInput = ({
    label,
    placeholder,
    validator,
    valueConsumer,
    invalidLabel
}: TextInputProps) => {
    const [value, setValue] = useState<FormValue<string>>({
        value: undefined,
        isValid: true,
    });

    const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
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
        <FormControl>
            <FormLabel color={value.isValid ? "" : "crimson"}>{label}</FormLabel>
            <Input
                placeholder={placeholder}
                borderColor={value.isValid ? "" : "crimson"}
                borderWidth={value.isValid ? "" : "2px"}
                onChange={handleChange}
            />
            {!value.isValid && !!invalidLabel && <Text fontSize='sm' color="crimson">{invalidLabel}</Text>}
        </FormControl>
    );
};