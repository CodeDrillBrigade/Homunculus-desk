import { FormValue } from '../../models/form/FormValue'
import { getRandomDarkHexColor } from '../../utils/style-utils'
import React, { useCallback, useEffect } from 'react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/react'
import { ErrorAlert } from '../errors/ErrorAlert'
import { TextInput } from '../forms/controls/TextInput'
import { ColorPicker } from '../forms/controls/ColorPicker'
import { tagColors } from '../../styles/colors'
import { Tag as MetaTag } from '../../models/embed/Tag'
import { SerializedError } from '@reduxjs/toolkit'
import { FormValues, useForm } from '../../hooks/form'
import { useFormControl } from '../../hooks/form-control'

interface TagFormInitialState {
	name?: string
	color?: string
}

interface AddTagModalProps {
	isOpen: boolean
	onClose: () => void
	action: (tag: Partial<MetaTag>) => void
	error?: FetchBaseQueryError | SerializedError
	isSuccessful: boolean
	initialState?: TagFormInitialState
	reset: () => void
	isLoading: boolean
}

interface AddTagFormData extends FormValues {
	name: FormValue<string>
	color: FormValue<string>
}

export const AddTagModal = ({
	isOpen,
	onClose,
	action,
	error,
	isSuccessful,
	initialState,
	reset,
	isLoading,
}: AddTagModalProps) => {
	const startingColor = getRandomDarkHexColor()
	const { formState, dispatchState, isInvalid } = useForm<AddTagFormData>({
		initialState: {
			name: { value: initialState?.name, isValid: !!initialState?.name },
			color: { value: initialState?.color ?? startingColor, isValid: true },
		},
	})
	const nameControls = useFormControl<string>({
		defaultValue: initialState?.name,
		validator: input => !!input && input.length <= 50,
		valueConsumer: data => dispatchState('name', data),
	})
	const colorControls = useFormControl<string>({
		defaultValue: initialState?.color ?? startingColor,
		valueConsumer: data => dispatchState('color', data),
	})

	useEffect(() => {
		if (isSuccessful && !error) {
			onClose()
		}
	}, [onClose, error, isSuccessful])

	const onSubmit = useCallback(
		(formData: AddTagFormData) => {
			const name = formData.name.value
			const color = formData.color.value
			if (!name) {
				throw Error('Tag name is not valid')
			}
			if (!color) {
				throw Error('Color is not valid')
			}
			action({ name, color })
			nameControls.resetValue()
			colorControls.resetValue()
			dispatchState('reset')
			reset()
		},
		[action, colorControls, dispatchState, nameControls, reset]
	)

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Save Tag Information</ModalHeader>
				<ModalCloseButton />

				<ModalBody>
					{!!error && <ErrorAlert info={{ label: 'Cannot create the Tag', reason: error }} />}
					<TextInput
						label="Name"
						placeholder="Name (max. 50 characters)"
						controls={nameControls}
						invalidLabel="Invalid tag name"
					/>
					<ColorPicker marginTop="2em" colors={tagColors} label="Tag color" controls={colorControls} />
				</ModalBody>

				<ModalFooter>
					<Button
						colorScheme="blue"
						mr={3}
						isDisabled={isInvalid}
						isLoading={isLoading}
						onClick={() => {
							onSubmit(formState)
						}}
					>
						Create
					</Button>
					<Button variant="ghost" onClick={onClose}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}
