import {
	Alert,
	AlertIcon,
	Button,
	Card,
	CardBody,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalOverlay,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { FormValues, useForm } from '../../hooks/form'
import { FormValue } from '../../models/form/FormValue'
import { User } from '../../models/User'
import { TextInput } from './controls/TextInput'
import React, { useEffect, useState } from 'react'
import { NumberInput } from './controls/NumberInput'
import { MaterialFilterInput } from './controls/MaterialFilterInput'
import { NotificationFilter } from '../../models/form/NotificationFilter'
import { UsersSelector } from './controls/UsersSelector'
import { useCreateAlertMutation } from '../../services/alert'
import { useFormControl } from '../../hooks/form-control'
import { ErrorAlert } from '../errors/ErrorAlert'

interface AlertFormValues extends FormValues {
	name: FormValue<string>
	description: FormValue<string>
	filters: FormValue<NotificationFilter>
	threshold: FormValue<number>
	recipients: FormValue<User[]>
}

const initialState: AlertFormValues = {
	name: { value: undefined, isValid: false },
	description: { value: undefined, isValid: true },
	filters: { value: undefined, isValid: false },
	threshold: { value: undefined, isValid: false },
	recipients: { value: undefined, isValid: false },
}

export const AddAlertForm = () => {
	const [isFormReset, setIsFormReset] = useState<boolean>(false)
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [createAlert, { error, isLoading, isSuccess, reset: resetMutation }] = useCreateAlertMutation()
	const { formState, dispatchState, isInvalid } = useForm({ initialState })

	const nameControls = useFormControl<string>({
		validator: input => !!input && input.length <= 50,
		valueConsumer: data => dispatchState('name', data),
	})

	const descriptionControls = useFormControl<string>({
		valueConsumer: data => dispatchState('description', data),
	})

	const thresholdControls = useFormControl<number>({
		defaultValue: 0,
		validator: input => !!input && input > 0,
		valueConsumer: data => dispatchState('threshold', data),
	})

	const recipientControls = useFormControl<User[]>({
		validator: input => !!input && input.length > 0,
		valueConsumer: data => dispatchState('recipients', data),
	})

	const filterControls = useFormControl<NotificationFilter>({
		validator: input => !!input,
		valueConsumer: data => dispatchState('filters', data),
	})

	const onSubmit = () => {
		if (!isInvalid) {
			if (!formState.name.isValid || !formState.name.value) {
				console.error('Name is not valid!')
				return
			}
			if (!formState.threshold.isValid || !formState.threshold.value) {
				console.error('Threshold is not valid!')
				return
			}
			if (!formState.recipients.isValid || !formState.recipients.value) {
				console.error('Recipients is not valid!')
				return
			}
			if (!formState.filters.isValid || !formState.filters.value) {
				console.error('Filters is not valid!')
				return
			}
			setIsFormReset(false)
			createAlert({
				name: formState.name.value,
				description: formState.description.value,
				threshold: formState.threshold.value,
				recipients: formState.recipients.value.map(it => it._id),
				materialFilter: formState.filters.value.includeFilter,
				excludeFilter: formState.filters.value.excludeFilter,
			})
		}
	}

	useEffect(() => {
		if (isSuccess && !isFormReset) {
			setIsFormReset(true)
			nameControls.resetValue()
			descriptionControls.resetValue()
			thresholdControls.resetValue()
			recipientControls.resetValue()
			filterControls.resetValue()
			dispatchState('reset')
			resetMutation()
			onOpen()
		}
	}, [
		descriptionControls,
		dispatchState,
		filterControls,
		isFormReset,
		isSuccess,
		nameControls,
		onOpen,
		recipientControls,
		resetMutation,
		thresholdControls,
	])

	return (
		<Card mt="2em" mr="2em" ml="2em">
			<CardBody>
				<VStack>
					{!!error && <ErrorAlert info={{ label: 'Something went wrong', reason: error }} />}
					<TextInput
						label="Name"
						placeholder="Alert name"
						controls={nameControls}
						invalidLabel="Name cannot be empty or greater than 50 characters."
					/>
					<TextInput
						label="Description"
						placeholder="Alert description (optional)"
						controls={descriptionControls}
					/>
					<NumberInput
						label="Threshold"
						controls={thresholdControls}
						invalidLabel="Threshold must be greater than 0."
					/>
					<UsersSelector
						label="Recipient users"
						placeholder="Select the recipients for the alert"
						controls={recipientControls}
						invalidLabel="You must specify at least one recipient."
					/>
					<MaterialFilterInput
						mt="2em"
						label="Select the materials"
						controls={filterControls}
						invalidLabel="You must specify at least one material."
					/>
					<Button colorScheme="blue" mr={3} onClick={onSubmit} isDisabled={isInvalid} isLoading={isLoading}>
						Create
					</Button>
				</VStack>
			</CardBody>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalBody>
						<Alert status="success">
							<AlertIcon />
							Operation completed successfully.
						</Alert>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" onClick={onClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Card>
	)
}
