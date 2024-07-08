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
import { useFormControl } from '../../hooks/form-control'
import { ErrorAlert } from '../errors/ErrorAlert'
import { Alert as AlertModel } from '../../models/Alert'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'

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

interface AddAlertFormProps {
	submitAction: (alert: Partial<AlertModel>) => void
	submitError: FetchBaseQueryError | SerializedError | undefined
	submitIsLoading: boolean
	submitSuccess: boolean
	reset: () => void
	state?: AlertFormValues
}

export const AddAlertForm = ({
	submitAction,
	submitError,
	submitIsLoading,
	submitSuccess,
	reset,
	state,
}: AddAlertFormProps) => {
	const [isFormReset, setIsFormReset] = useState<boolean>(false)
	const { isOpen, onOpen, onClose } = useDisclosure()
	const { formState, dispatchState, isInvalid } = useForm({ initialState: state ?? initialState })

	const nameControls = useFormControl<string>({
		defaultValue: state?.name?.value ?? initialState?.name?.value,
		validator: input => !!input && input.length <= 50,
		valueConsumer: data => dispatchState('name', data),
	})

	const descriptionControls = useFormControl<string>({
		defaultValue: state?.description?.value ?? initialState?.description?.value,
		valueConsumer: data => dispatchState('description', data),
	})

	const thresholdControls = useFormControl<number>({
		defaultValue: state?.threshold?.value ?? initialState?.threshold?.value ?? 0,
		validator: input => !!input && input > 0,
		valueConsumer: data => dispatchState('threshold', data),
	})

	const recipientControls = useFormControl<User[]>({
		defaultValue: state?.recipients?.value ?? initialState?.recipients?.value,
		validator: input => !!input && input.length > 0,
		valueConsumer: data => dispatchState('recipients', data),
	})

	const filterControls = useFormControl<NotificationFilter>({
		defaultValue: state?.filters?.value ?? initialState?.filters?.value,
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
			submitAction({
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
		if (submitSuccess && !isFormReset) {
			setIsFormReset(true)
			nameControls.resetValue()
			descriptionControls.resetValue()
			thresholdControls.resetValue()
			recipientControls.resetValue()
			filterControls.resetValue()
			dispatchState('reset')
			reset()
			onOpen()
		}
	}, [
		descriptionControls,
		dispatchState,
		filterControls,
		isFormReset,
		submitSuccess,
		nameControls,
		onOpen,
		recipientControls,
		reset,
		thresholdControls,
	])

	return (
		<Card mt="2em" mr="2em" ml="2em">
			<CardBody>
				<VStack>
					{!!submitError && <ErrorAlert info={{ label: 'Something went wrong', reason: submitError }} />}
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
					<Button
						colorScheme="blue"
						mr={3}
						onClick={onSubmit}
						isDisabled={isInvalid}
						isLoading={submitIsLoading}
					>
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
