import { Box as BoxModel } from '../../models/Box'
import { useIsMobileLayout } from '../../hooks/responsive-size'
import {
	Button,
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Tooltip,
} from '@chakra-ui/react'
import { FormValues, useForm } from '../../hooks/form'
import { FormValue } from '../../models/form/FormValue'
import React, { useCallback, useState } from 'react'
import { EditableTextInput } from '../forms/controls/EditableTextInput'
import { ShelfSelector } from '../forms/controls/ShelfSelector'
import { DatePicker } from '../forms/controls/DatePicker'
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons'
import { extractErrorMessage } from '../../utils/error-utils'
import { useModifyBoxMutation } from '../../services/box'

interface EditBoxModalProps {
	onClose: () => void
	isOpen: boolean
	box: BoxModel
}

interface UpdateBoxFormValues extends FormValues {
	description: FormValue<string>
	batchNumber: FormValue<string>
	position: FormValue<string>
	expirationDate: FormValue<Date>
}

export const EditBoxModal = ({ isOpen, onClose, box }: EditBoxModalProps) => {
	const initialState: UpdateBoxFormValues = {
		description: { value: undefined, isValid: true },
		batchNumber: { value: undefined, isValid: true },
		position: { value: undefined, isValid: true },
		expirationDate: { value: !!box.expirationDate ? new Date(box.expirationDate) : undefined, isValid: true },
	}

	const isMobile = useIsMobileLayout()
	const [formIsTouched, setFormIsTouched] = useState<boolean>(false)
	const { formState, dispatchState, isInvalid } = useForm({ initialState })
	const [modifyBox, { error: modifyError, isLoading: modifyLoading, isSuccess: modifySuccess }] =
		useModifyBoxMutation()

	const onBoxUpdate = useCallback(
		(formState: UpdateBoxFormValues) => {
			const updatedMaterial: BoxModel = {
				...box,
				description: formState.description.value ?? box.description,
				batchNumber: formState.batchNumber.value ?? box.batchNumber,
				position: formState.position.value ?? box.position,
				expirationDate: formState.expirationDate.value?.getTime() ?? null,
			}
			modifyBox(updatedMaterial)
		},
		[box, modifyBox]
	)

	return (
		<Modal isOpen={isOpen} onClose={onClose} size={isMobile ? 'full' : 'xl'}>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<ModalHeader>Edit a Box</ModalHeader>
				<ModalBody>
					<EditableTextInput
						label=""
						placeholder="Description"
						defaultValue={box.description}
						valueConsumer={payload => {
							setFormIsTouched(true)
							dispatchState('description', payload)
						}}
					/>
					<EditableTextInput
						label=""
						placeholder="Batch Number"
						defaultValue={box.batchNumber}
						valueConsumer={payload => {
							setFormIsTouched(true)
							dispatchState('batchNumber', payload)
						}}
					/>
					<DatePicker
						label="Expiration Date"
						mt="1em"
						defaultValue={!!box.expirationDate ? new Date(box.expirationDate) : undefined}
						valueConsumer={payload => {
							setFormIsTouched(true)
							dispatchState('expirationDate', payload)
						}}
					/>
					<ShelfSelector
						label="Shelf"
						mt="1em"
						defaultValue={box.position}
						valueConsumer={payload => {
							setFormIsTouched(true)
							dispatchState('position', payload)
						}}
					/>
				</ModalBody>
				<ModalFooter>
					<Flex width="full" justifyContent="start">
						<Flex>
							<Button
								colorScheme="blue"
								isDisabled={isInvalid || !formIsTouched}
								isLoading={modifyLoading}
								onClick={() => {
									onBoxUpdate(formState)
								}}
							>
								Update Material
							</Button>
							{modifySuccess && <CheckCircleIcon boxSize={6} color="green.400" mt="0.5em" ml="0.5em" />}
							{!!modifyError && (
								<Tooltip label={extractErrorMessage(modifyError)} fontSize="md">
									<WarningIcon boxSize={6} color="red.400" mt="0.5em" ml="0.5em" />
								</Tooltip>
							)}
						</Flex>
					</Flex>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}
