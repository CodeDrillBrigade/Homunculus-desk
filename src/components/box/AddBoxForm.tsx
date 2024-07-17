import { Alert, AlertIcon, AlertTitle, Button, Card, CardBody, SpaceProps, Text, VStack } from '@chakra-ui/react'
import { MaterialSelector } from '../forms/controls/MaterialSelector'
import { ShelfSelector } from '../forms/controls/ShelfSelector'
import { FormValue } from '../../models/form/FormValue'
import { Material } from '../../models/Material'
import { FormValues, useForm } from '../../hooks/form'
import { useGetBoxDefinitionQuery } from '../../services/boxDefinition'
import { TextInput } from '../forms/controls/TextInput'
import { DatePicker } from '../forms/controls/DatePicker'
import { useCreateBoxMutation } from '../../services/box'
import React, { useEffect, useMemo, useState } from 'react'
import { BoxUnit } from '../../models/embed/BoxUnit'
import { useFormControl } from '../../hooks/form-control'
import { ErrorAlert } from '../errors/ErrorAlert'
import { NumberInput } from '../forms/controls/NumberInput'
import { describeStep, unitToStepsList } from '../../models/embed/UnitStep'

interface AddBoxFormProps extends SpaceProps {
	defaultMaterial?: Material
	defaultPosition?: string
	onDispatchSuccess?: () => void
}

interface BoxFormValue extends FormValues {
	material: FormValue<Material>
	expirationDate: FormValue<Date>
	batchNumber: FormValue<string>
	shelf: FormValue<string>
	description: FormValue<string>
	quantity: FormValue<BoxUnit>
}

const initialState: BoxFormValue = {
	material: { value: undefined, isValid: false },
	shelf: { value: undefined, isValid: true },
	batchNumber: { value: undefined, isValid: true },
	expirationDate: { value: undefined, isValid: true },
	quantity: { value: undefined, isValid: false },
	description: { value: undefined, isValid: true },
}

export const AddBoxForm = ({ defaultMaterial, defaultPosition, onDispatchSuccess, ...style }: AddBoxFormProps) => {
	const [isFormReset, setIsFormReset] = useState<boolean>(false)
	const [createBox, { error, isLoading, isSuccess }] = useCreateBoxMutation()
	const { formState, dispatchState, isInvalid } = useForm({
		initialState: {
			...initialState,
			material: { value: defaultMaterial, isValid: !!defaultMaterial },
			shelf: { value: defaultPosition, isValid: true },
		},
	})
	const currentBoxDefinitionId = formState.material.value?.boxDefinition
	const { data: boxDefinition } = useGetBoxDefinitionQuery(currentBoxDefinitionId ?? '', {
		skip: !currentBoxDefinitionId || currentBoxDefinitionId.length <= 0,
	})

	const lastStep = useMemo(() => {
		if (!boxDefinition) return null
		const steps = unitToStepsList(boxDefinition.boxUnit)
		return steps[steps.length - 1]
	}, [boxDefinition])

	const totalInBox = useMemo(() => {
		if (!boxDefinition) return null
		return unitToStepsList(boxDefinition.boxUnit).reduce((p, c) => p * c.qty, 1)
	}, [boxDefinition])

	const descriptionControls = useFormControl<string>({ valueConsumer: value => dispatchState('description', value) })
	const shelfControls = useFormControl<string>({
		defaultValue: defaultPosition,
		valueConsumer: value => dispatchState('shelf', value),
	})
	const batchNumberControls = useFormControl<string>({
		valueConsumer: value => dispatchState('batchNumber', value),
	})
	const dateControls = useFormControl<Date>({
		valueConsumer: value => dispatchState('expirationDate', value),
		defaultValue: undefined,
	})
	const materialControls = useFormControl<Material>({
		defaultValue: defaultMaterial,
		validator: input => !!input,
		valueConsumer: value => dispatchState('material', value),
	})
	const quantityControls = useFormControl<number>({
		defaultValue: 0,
		validator: input => !!totalInBox && !!input && input >= 1,
		valueConsumer: value => {
			if (!!totalInBox && !!lastStep && !!value.value) {
				dispatchState('quantity', {
					value: { quantity: value.value * totalInBox, metric: lastStep.type },
					isValid: value.isValid,
				})
			}
		},
	})

	const onSubmit = () => {
		if (!isInvalid) {
			if (!formState.material.isValid || !formState.material.value) {
				console.error('Material is not valid!')
				return
			}
			if (!formState.quantity.isValid || !formState.quantity.value) {
				console.error('Quantity is not valid!')
				return
			}
			setIsFormReset(false)
			createBox({
				description: formState.description.value,
				material: formState.material.value._id,
				batchNumber: formState.batchNumber.value,
				expirationDate: formState.expirationDate.value?.getTime(),
				position: formState.shelf.value,
				quantity: formState.quantity.value,
				usageLogs: [],
			})
		}
	}

	useEffect(() => {
		if (isSuccess && !isFormReset) {
			setIsFormReset(true)
			descriptionControls.resetValue()
			shelfControls.resetValue()
			materialControls.resetValue()
			dateControls.resetValue()
			quantityControls.resetValue()
			dispatchState('reset')
			if (!!onDispatchSuccess) {
				onDispatchSuccess()
			}
		}
	}, [
		dateControls,
		descriptionControls,
		dispatchState,
		isFormReset,
		isSuccess,
		materialControls,
		onDispatchSuccess,
		quantityControls,
		shelfControls,
	])

	return (
		<Card mt="2em" {...style}>
			<CardBody>
				<VStack>
					<TextInput
						label="Description"
						placeholder="Description (optional)"
						controls={descriptionControls}
					/>
					<TextInput
						label="Batch number"
						placeholder="Batch number"
						controls={batchNumberControls}
						invalidLabel="You must enter the batch number"
					/>
					<DatePicker label="Expiration date" marginTop="1.5em" controls={dateControls} />
					<ShelfSelector
						label="Shelf"
						controls={shelfControls}
						invalidLabel="You must select a shelf"
						marginTop="1.5em"
					/>
					<MaterialSelector
						label="Material"
						placeholder="Choose a material"
						controls={materialControls}
						invalidLabel="You must select a valid material"
						marginTop="1.5em"
					/>
					{formState.material.isValid && !!boxDefinition?.boxUnit && !!lastStep && (
						<>
							<NumberInput
								defaultValue={0}
								label="How many boxes do you want to add on this shelf?"
								min={0}
								controls={quantityControls}
								mt="1em"
								invalidLabel="Quantity is required and must be greater than 0"
							/>
							<Text marginTop="0.7em">
								{`Total: ${formState.quantity.value?.quantity ?? 0} ${describeStep(
									lastStep,
									undefined
								)}`}
							</Text>
						</>
					)}
					<Button colorScheme="blue" mr={3} onClick={onSubmit} isDisabled={isInvalid} isLoading={isLoading}>
						Create
					</Button>
					{!!error && <ErrorAlert info={{ label: 'Cannot create box', reason: error }} />}
					{isSuccess && (
						<Alert status="success" borderRadius="md">
							<AlertIcon />
							<AlertTitle>Operation completed successfully</AlertTitle>
						</Alert>
					)}
				</VStack>
			</CardBody>
		</Card>
	)
}
