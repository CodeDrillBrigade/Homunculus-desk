import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	VStack,
} from '@chakra-ui/react'
import { ErrorAlert } from '../errors/ErrorAlert'
import { TextInput } from '../forms/controls/TextInput'
import { useEffect, useState } from 'react'
import { FormValue } from '../../models/form/FormValue'

interface ChangeStorageNameModalProps {
	onClose: () => void
	isOpen: boolean
	isLoading: boolean
	title: string
	defaultValue: string
	error?: any | undefined
	onConfirm: (value: string) => void
	isSuccess?: boolean
}

export const ChangeStorageNameModal = ({
	isOpen,
	onClose,
	title,
	error,
	onConfirm,
	isLoading,
	defaultValue,
	isSuccess,
}: ChangeStorageNameModalProps) => {
	const [newName, setNewName] = useState<FormValue<string>>({ value: defaultValue, isValid: false })

	useEffect(() => {
		if (!!isSuccess) {
			onClose()
		}
	}, [isSuccess, onClose])

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					<Text>{title}</Text>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack>
						{!!error && <ErrorAlert info={{ label: 'Something went wrong', reason: error }} />}
						<TextInput
							label="New name"
							placeholder="Insert the new name"
							defaultValue={defaultValue}
							validator={input => !!input && input.trim().length <= 50}
							valueConsumer={setNewName}
						/>
					</VStack>
				</ModalBody>

				<ModalFooter>
					<Button
						colorScheme="blue"
						mr={3}
						onClick={() => {
							if (!newName.isValid || !newName.value) {
								throw new Error('New name is invalid!')
							}
							onConfirm(newName.value)
						}}
						isLoading={isLoading}
						isDisabled={!newName.isValid}
					>
						Update
					</Button>
					<Button colorScheme="gray" onClick={onClose}>
						Cancel
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}
