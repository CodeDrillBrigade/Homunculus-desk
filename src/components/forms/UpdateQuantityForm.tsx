import { Box } from '../../models/Box'
import { useGetCurrentUserQuery } from '../../services/user'
import { Button, Container, Flex, Icon } from '@chakra-ui/react'
import { DatePicker } from './controls/DatePicker'
import { BoxUnitSelector } from './controls/BoxUnitSelector'
import { BoxUnit } from '../../models/embed/BoxUnit'
import { ErrorAlert } from '../errors/ErrorAlert'
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi'
import { FormValue } from '../../models/form/FormValue'
import { FormValues, useForm } from '../../hooks/form'
import { useUpdateQuantityMutation } from '../../services/box'
import { useCallback, useEffect, useMemo } from 'react'
import { Operation } from '../../models/embed/Operation'
import { unitToStepsList } from '../../models/embed/UnitStep'
import { computeTotal } from '../../utils/box-utils'

interface UpdateQuantityFormProps {
	box: Box
	boxDefinition: BoxUnit
	onDispatched: () => void
}

interface UpdateQuantityFormValues extends FormValues {
	date: FormValue<number>
	quantity: FormValue<BoxUnit>
}

export const UpdateQuantityForm = ({ box, boxDefinition, onDispatched }: UpdateQuantityFormProps) => {
	const unitSteps = useMemo(() => unitToStepsList(boxDefinition), [boxDefinition])
	const initialState: UpdateQuantityFormValues = {
		date: { value: new Date().getTime(), isValid: true },
		quantity: {
			value: {
				quantity: computeTotal(
					unitSteps,
					unitSteps
						.slice(0, unitSteps.length - 1)
						.map(_ => 0)
						.concat([1])
				),
				metric: unitSteps[unitSteps.length - 1].type,
			},
			isValid: true,
		},
	}

	const { formState, dispatchState, isInvalid } = useForm({ initialState })
	const { data: currentUser, error: currentUserError } = useGetCurrentUserQuery()
	const [updateQuantity, { error, isLoading, isSuccess }] = useUpdateQuantityMutation()

	const dispatchForm = useCallback(
		(operation: Operation, formValues: UpdateQuantityFormValues) => {
			if (!formValues.date.value || !formValues.date.isValid) {
				console.error('Date is invalid')
				return
			}
			if (!formValues.quantity.value || !formValues.quantity.isValid) {
				console.error('Quantity is invalid')
				return
			}
			if (!currentUser) {
				console.error('User not loaded')
				return
			}
			updateQuantity({
				box,
				update: {
					date: formValues.date.value,
					user: currentUser._id,
					quantity: formValues.quantity.value,
					operation,
				},
			})
		},
		[box, currentUser, updateQuantity]
	)

	useEffect(() => {
		if (isSuccess) {
			onDispatched()
		}
	}, [isSuccess, onDispatched])

	return (
		<Container>
			{!!currentUserError && <ErrorAlert info={{ label: 'Cannot get current user', reason: currentUserError }} />}
			<DatePicker
				label="Date of the update"
				defaultValue={new Date()}
				validator={input => !!input}
				valueConsumer={value => {
					dispatchState('date', value)
				}}
				invalidLabel="You must choose a valid date"
			/>
			<BoxUnitSelector
				boxUnit={boxDefinition}
				label="Select the quantity to update"
				validator={input => !!input && !input.boxUnit && input.quantity > 0}
				valueConsumer={value => {
					dispatchState('quantity', value)
				}}
				invalidLabel="The quantity must be greater than 0"
				marginTop="1em"
			/>
			<Flex width="full" justifyContent="space-between" marginTop="1em">
				<Button
					colorScheme="blue"
					leftIcon={<Icon as={FiPlusCircle} />}
					isDisabled={isInvalid || !currentUser}
					isLoading={isLoading}
					onClick={() => {
						dispatchForm(Operation.ADD, formState)
					}}
				>
					Add
				</Button>
				<Button
					colorScheme="red"
					leftIcon={<Icon as={FiMinusCircle} />}
					isDisabled={isInvalid || !currentUser}
					isLoading={isLoading}
					onClick={() => {
						dispatchForm(Operation.REMOVE, formState)
					}}
				>
					Remove
				</Button>
				{!!error && <ErrorAlert info={{ label: 'Cannot update material', reason: error }} />}
			</Flex>
		</Container>
	)
}
