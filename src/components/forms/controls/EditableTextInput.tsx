import {
	ButtonGroup,
	Editable,
	EditableInput,
	EditablePreview,
	Flex,
	FormControl,
	FormLabel,
	Icon,
	IconButton,
	LayoutProps,
	SpaceProps,
	Text,
	useEditableControls,
} from '@chakra-ui/react'
import { FormValue } from '../../../models/form/FormValue'
import React from 'react'
import { FormControls, useFormControl } from '../../../hooks/form-control'
import { PencilSimple, X, Check } from '@phosphor-icons/react'

interface EditableTextInputProps extends LayoutProps, SpaceProps {
	label: string
	placeholder: string
	defaultValue?: string
	validator?: (input?: string) => boolean
	valueConsumer?: (value: FormValue<string>) => void
	invalidLabel?: string
	controls?: FormControls<string>
}

export const EditableTextInput = ({
	label,
	placeholder,
	validator,
	valueConsumer,
	invalidLabel,
	controls,
	defaultValue,
	...style
}: EditableTextInputProps) => {
	const { value, setValue } = useFormControl<string>({ validator, valueConsumer, defaultValue })
	const innerValue = controls?.value ?? value
	const innerSetValue = controls?.setValue ?? setValue

	function EditableControls() {
		const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls()

		return (
			<>
				{!isEditing && (
					<IconButton
						icon={<Icon as={PencilSimple} weight="bold" />}
						aria-label="edit"
						position="absolute"
						right="0.5rem"
						size="sm"
						{...getEditButtonProps()}
					/>
				)}
				{isEditing && (
					<ButtonGroup justifyContent="center" size="sm" ml="0.5rem">
						<IconButton
							aria-label="confirm"
							icon={<Icon as={Check} weight="bold" boxSize={5} />}
							{...getSubmitButtonProps()}
						/>
						<IconButton
							aria-label="cancel"
							icon={<Icon as={X} weight="bold" boxSize={5} />}
							{...getCancelButtonProps()}
						/>
					</ButtonGroup>
				)}
			</>
		)
	}

	return (
		<FormControl {...style}>
			<FormLabel color={innerValue.isValid ? '' : 'red'}>{label}</FormLabel>
			<Editable defaultValue={innerValue.value ?? placeholder} onSubmit={innerSetValue}>
				<Flex align="center">
					<EditablePreview flex="1" paddingRight="2rem" />
					<EditableInput
						borderColor={innerValue.isValid ? '' : 'red'}
						borderWidth={innerValue.isValid ? '' : '2px'}
						value={innerValue.value ?? ''}
					/>
					<EditableControls />
				</Flex>
			</Editable>
			{!innerValue.isValid && !!invalidLabel && (
				<Text fontSize="sm" color="red">
					{invalidLabel}
				</Text>
			)}
		</FormControl>
	)
}
