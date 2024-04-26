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
import { TextInput } from './controls/TextInput'
import { TextArea } from './controls/TextArea'
import { FormValue } from '../../models/form/FormValue'
import { useEffect } from 'react'
import { ErrorInfo } from '../../models/errors/ErrorInfo'
import { ErrorAlert } from '../errors/ErrorAlert'
import { useForm, FormValues } from '../../hooks/form'

interface TextWithDescriptionModalProps {
	title: string
	isOpen: boolean
	onClose: () => void
	onSubmit: (formData: TextWithDescriptionFormData) => void
	isSubmitting: boolean
	error?: ErrorInfo
	shouldClose: boolean
}

export interface TextWithDescriptionFormData extends FormValues {
	name: FormValue<string>
	description: FormValue<string>
}

const initialState: TextWithDescriptionFormData = {
	name: { value: undefined, isValid: false },
	description: { value: undefined, isValid: true },
}

export const TextWithDescriptionModal = ({
	title,
	isOpen,
	onClose,
	onSubmit,
	isSubmitting,
	error,
	shouldClose,
}: TextWithDescriptionModalProps) => {
	const { formState, dispatchState, isInvalid: isFormInvalid } = useForm({ initialState })

	useEffect(() => {
		if (shouldClose) {
			onClose()
		}
	}, [onClose, shouldClose])

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{title}</ModalHeader>
				<ModalCloseButton />

				<ModalBody>
					{!!error && <ErrorAlert info={error} />}
					<TextInput
						label="Name"
						placeholder="Name (max. 50 characters)"
						validator={input => !!input && input.trim().length <= 50}
						valueConsumer={value => {
							dispatchState('name', value)
						}}
						invalidLabel="Name cannot be empty"
					/>
					<TextArea
						marginTop="2em"
						label="Description"
						placeholder="Description (optional, max. 300 characters)"
						validator={input => !input || input.trim().length <= 300}
						valueConsumer={value => {
							dispatchState('description', value)
						}}
					/>
				</ModalBody>

				<ModalFooter>
					<Button
						colorScheme="blue"
						mr={3}
						onClick={() => {
							onSubmit(formState)
						}}
						isDisabled={isFormInvalid}
						isLoading={isSubmitting}
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
