import {
	Alert,
	AlertIcon,
	Button,
	Card,
	CardBody,
	CardFooter,
	Flex,
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
import React, { useCallback, useEffect, useState } from 'react'
import { NumberInput } from './controls/NumberInput'
import { MaterialFilterInput } from './controls/MaterialFilterInput'
import { NotificationFilter } from '../../models/form/NotificationFilter'
import { UsersSelector } from './controls/UsersSelector'
import { useFormControl } from '../../hooks/form-control'
import { ErrorAlert } from '../errors/ErrorAlert'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { ActivationMoment } from '../../models/embed/ActivationMoment'
import { Report } from '../../models/Report'
import { MultipleActivationMomentsSelector } from './controls/MultipleActivationMomentsSelector'

interface ReportFormValues extends FormValues {
	name: FormValue<string>
	description: FormValue<string>
	repeatAt: FormValue<ActivationMoment[]>
	filters: FormValue<NotificationFilter>
	threshold: FormValue<number>
	recipients: FormValue<User[]>
}

interface ReportFormInitialState {
	name?: string
	description?: string
	repeatAt?: ActivationMoment[]
	filters?: NotificationFilter
	threshold?: number
	recipients?: User[]
}

interface AddAlertFormProps {
	submitAction: (report: Partial<Report>) => void
	submitError: FetchBaseQueryError | SerializedError | undefined
	submitIsLoading: boolean
	submitSuccess: boolean
	reset: () => void
	state?: ReportFormInitialState
	buttonLabel: string
	closeButtonAction?: () => void
	onConfirmAction?: () => void
}

export const AddReportForm = ({
	submitAction,
	submitError,
	submitIsLoading,
	submitSuccess,
	reset,
	state,
	buttonLabel,
	closeButtonAction,
	onConfirmAction,
}: AddAlertFormProps) => {
	const [isFormReset, setIsFormReset] = useState<boolean>(false)
	const { isOpen, onOpen, onClose } = useDisclosure()
	const { formState, dispatchState, isInvalid } = useForm<ReportFormValues>({
		initialState: {
			name: { value: state?.name, isValid: !!state?.name },
			description: { value: state?.description, isValid: true },
			repeatAt: { value: state?.repeatAt, isValid: !!state?.repeatAt },
			filters: { value: state?.filters, isValid: !!state?.filters },
			threshold: { value: state?.threshold, isValid: true },
			recipients: { value: state?.recipients, isValid: !!state?.recipients },
		},
	})

	const onConfirm = useCallback(() => {
		onClose()
		if (!!onConfirmAction) {
			onConfirmAction()
		}
	}, [onClose, onConfirmAction])

	const nameControls = useFormControl<string>({
		defaultValue: state?.name,
		validator: input => !!input && input.length <= 50,
		valueConsumer: data => dispatchState('name', data),
	})

	const descriptionControls = useFormControl<string>({
		defaultValue: state?.description,
		valueConsumer: data => dispatchState('description', data),
	})

	const thresholdControls = useFormControl<number>({
		defaultValue: state?.threshold ?? 0,
		validator: input => !!input && input > 0,
		valueConsumer: data => dispatchState('threshold', data),
	})

	const recipientControls = useFormControl<User[]>({
		defaultValue: state?.recipients,
		validator: input => !!input && input.length > 0,
		valueConsumer: data => dispatchState('recipients', data),
	})

	const activationControls = useFormControl<ActivationMoment[]>({
		defaultValue: state?.repeatAt,
		validator: input => !!input && input.length > 0,
		valueConsumer: data => dispatchState('repeatAt', data),
	})

	const filterControls = useFormControl<NotificationFilter>({
		defaultValue: state?.filters,
		validator: input => !!input,
		valueConsumer: data => dispatchState('filters', data),
	})

	const onSubmit = () => {
		if (!isInvalid) {
			if (!formState.name.isValid || !formState.name.value) {
				console.error('Name is not valid!')
				return
			}
			if (!formState.repeatAt.isValid || !formState.repeatAt.value) {
				console.error('RepeatAt is not valid!')
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
				repeatAt: formState.repeatAt.value,
				threshold: formState.threshold.value,
				recipients: formState.recipients.value.map(it => it._id),
				materialFilter: formState.filters.value.includeFilter,
				excludeFilter: formState.filters.value.excludeFilter,
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
			activationControls.resetValue()
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
		activationControls,
	])

	return (
		<Card mr="2em" ml="2em">
			<CardBody>
				<VStack>
					{!!submitError && <ErrorAlert info={{ label: 'Something went wrong', reason: submitError }} />}
					<TextInput
						label="Name"
						placeholder="Report name"
						controls={nameControls}
						invalidLabel="Name cannot be empty or greater than 50 characters."
					/>
					<TextInput
						label="Description"
						placeholder="Report description (optional)"
						controls={descriptionControls}
					/>
					<NumberInput
						label="Threshold (in boxes)"
						controls={thresholdControls}
						invalidLabel="Threshold must be greater than 0."
					/>
					<UsersSelector
						label="Recipient users"
						placeholder="Select the recipients for the report"
						controls={recipientControls}
						invalidLabel="You must specify at least one recipient."
					/>
					<MultipleActivationMomentsSelector
						label="Sent at"
						controls={activationControls}
						invalidLabel="You must specify at least one valid send date."
					/>
					<MaterialFilterInput
						mt="2em"
						label="Select the materials"
						controls={filterControls}
						invalidLabel="You must specify at least one material."
					/>
				</VStack>
			</CardBody>
			<CardFooter>
				<Flex width="full" justifyContent="space-between">
					<Button
						colorScheme="blue"
						mr={3}
						onClick={onSubmit}
						isDisabled={isInvalid}
						isLoading={submitIsLoading}
					>
						{buttonLabel}
					</Button>
					{!!closeButtonAction && (
						<Button colorScheme="red" mr={3} onClick={closeButtonAction}>
							Close
						</Button>
					)}
				</Flex>
			</CardFooter>
			<Modal isOpen={isOpen} onClose={onConfirm}>
				<ModalOverlay />
				<ModalContent>
					<ModalBody>
						<Alert status="success">
							<AlertIcon />
							Operation completed successfully.
						</Alert>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" onClick={onConfirm}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Card>
	)
}
