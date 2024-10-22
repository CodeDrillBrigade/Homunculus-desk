import {
	Box,
	Container,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Skeleton,
	Step,
	StepIndicator,
	Stepper,
	StepSeparator,
	StepStatus,
	StepTitle,
} from '@chakra-ui/react'
import { TextInput } from './TextInput'
import { NumberInput } from './NumberInput'
import { SelectInput, SelectOption } from './SelectInput'
import { Metric } from '../../../models/embed/Metric'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useGetBoxDefinitionsQuery } from '../../../services/boxDefinition'
import { ErrorAlert } from '../../errors/ErrorAlert'
import { BoxDefinition } from '../../../models/embed/BoxDefinition'
import { useFormControl } from '../../../hooks/form-control'
import { FormValue } from '../../../models/form/FormValue'
import {
	defaultStep,
	firstStep,
	generateDescription,
	stepsListToUnit,
	unitIcons,
	UnitStep,
	unitToStepsList,
} from '../../../models/embed/UnitStep'

const measures: SelectOption<Metric>[] = [
	{ value: Metric.COMPLEX, name: 'Bag', id: 'Box' },
	{ value: Metric.PIECE, name: 'Units', id: 'Units' },
]

const isFormValid = (formValue: BoxDefinition) =>
	!!formValue && !!formValue.name && formValue.name.trim().length <= 50 && !!formValue.boxUnit

export const BoxDefinitionBuilder = ({
	valueConsumer,
}: {
	valueConsumer: (value: FormValue<BoxDefinition>) => void
}) => {
	const { data: boxDefinitions, error, isLoading } = useGetBoxDefinitionsQuery()
	const presetOptions = useMemo(() => {
		return !!boxDefinitions
			? ([{ value: null, name: 'New preset', id: 'new' }] as SelectOption<BoxDefinition | null>[]).concat(
					boxDefinitions.map(it => {
						return {
							value: it,
							name: `${it.name}${!!it?.description ? ' - ' + it.description : ''}`,
							id: it._id,
						}
					})
			  )
			: undefined
	}, [boxDefinitions])

	const [formValue, setFormValue] = useState<FormValue<BoxDefinition>>({
		value: undefined,
		isValid: false,
	})

	const nameControls = useFormControl<string>({
		validator: (value: string | undefined) => !!value && value.trim().length <= 50,
		valueConsumer: (value: FormValue<string>) => {
			setFormValue(prevState => {
				const newValue = {
					...(prevState.value ?? {}),
					_id: undefined,
					name: value.value?.trim() ?? '',
				}
				return {
					value: newValue,
					isValid: isFormValid(newValue),
				}
			})
		},
	})

	const descriptionControls = useFormControl<string>({
		valueConsumer: (value: FormValue<string>) => {
			setFormValue(prevState => {
				const newValue = {
					...(prevState.value ?? {}),
					_id: undefined,
					description: value.value?.trim(),
				}
				return {
					value: newValue,
					isValid: isFormValid(newValue),
				}
			})
		},
	})
	const [steps, setSteps] = useState<UnitStep[]>([firstStep, defaultStep])
	const [stepsId, setStepsId] = useState<string>(`${new Date().getTime()}`)

	useEffect(() => {
		valueConsumer(formValue)
	}, [formValue, valueConsumer])

	const updateSteps = useCallback(
		(idx: number, type: Metric) => {
			if (idx < steps.length && steps[idx].type !== type) {
				setSteps(currentSteps => {
					const currentStep = currentSteps[idx]
					const slicedSteps = currentSteps.slice(0, idx + 1)
					slicedSteps[idx] = {
						...currentStep,
						type: type,
						icon: unitIcons[type],
						description: generateDescription(currentStep.qty, type),
					}
					const newSteps = type === Metric.COMPLEX ? slicedSteps.concat(defaultStep) : [...slicedSteps]
					const stepsAsUnit = stepsListToUnit(newSteps)
					setFormValue(prevState => {
						if (!!stepsAsUnit && slicedSteps.every(step => step.qty > 0)) {
							const newValue = {
								...(prevState.value ?? {}),
								_id: undefined,
								boxUnit: stepsAsUnit,
							}
							return {
								value: newValue,
								isValid: isFormValid(newValue),
							}
						} else {
							return { ...prevState, isValid: false }
						}
					})
					return newSteps
				})
			}
		},
		[steps]
	)

	const updateStepQty = useCallback(
		(idx: number, qty: number) => {
			if (idx < steps.length) {
				setSteps(currentSteps => {
					const updatedSteps = [...currentSteps]
					updatedSteps[idx] = {
						...updatedSteps[idx],
						qty,
						description: generateDescription(qty, updatedSteps[idx].type),
					}
					const stepsAsUnit = stepsListToUnit(updatedSteps)
					setFormValue(prevState => {
						if (!!stepsAsUnit && updatedSteps.every(step => step.qty > 0)) {
							const newValue = {
								...(prevState.value ?? {}),
								_id: undefined,
								boxUnit: stepsAsUnit,
							}
							return {
								value: newValue,
								isValid: isFormValid(newValue),
							}
						} else {
							return { ...prevState, isValid: false }
						}
					})
					return updatedSteps
				})
			}
		},
		[steps.length]
	)

	const loadPreset = useCallback(
		(definition: BoxDefinition | null) => {
			nameControls.setValue(definition?.name)
			descriptionControls.setValue(definition?.description)
			setStepsId(definition?._id ?? `${new Date().getTime()}`)
			if (!!definition?.boxUnit) {
				setSteps(unitToStepsList(definition?.boxUnit))
			} else {
				setSteps([firstStep, defaultStep])
			}

			setFormValue({
				value: definition ?? undefined,
				isValid: !!definition && !!definition._id,
			})
		},
		[descriptionControls, nameControls]
	)

	const selectConsumer = useCallback(
		(value: FormValue<SelectOption<BoxDefinition | null>>) => {
			if (value.isValid && value.value !== undefined) {
				loadPreset(value.value.value)
			}
		},
		[loadPreset]
	)

	return (
		<FormControl borderWidth="1px" borderRadius="md" padding="0.6em">
			{isLoading && (
				<Container minWidth="100%" padding="0px" marginBottom="0.5em">
					<FormLabel>Presets</FormLabel>
					<Skeleton height="2em" borderRadius="md" />
				</Container>
			)}
			{!!error && <ErrorAlert info={{ label: 'Cannot load box presets', reason: error }} />}
			{!!presetOptions && (
				<SelectInput
					marginBottom="0.5em"
					label="Presets"
					placeholder="Existing presets"
					values={presetOptions}
					valueConsumer={selectConsumer}
				/>
			)}
			<TextInput
				label="Box structure name"
				placeholder="Name (max. 50 characters)"
				marginBottom="0.6em"
				controls={nameControls}
				invalidLabel="Box configuration name cannot be null"
			/>
			<TextInput
				label="Description"
				placeholder="Description (optional)"
				marginBottom="0.6em"
				controls={descriptionControls}
				mb="1em"
			/>
			<Stepper
				index={steps.length}
				orientation="vertical"
				gap="0"
				colorScheme={steps.every(step => step.qty > 0) ? undefined : 'red'}
			>
				{steps.map((step, stepIdx) => (
					<Step key={`box-step-${stepsId}-${stepIdx}`}>
						<StepIndicator>
							<StepStatus complete={step.icon} incomplete={step.icon} active={step.icon} />
						</StepIndicator>

						<Box flexShrink="0" marginBottom="1em">
							<StepTitle>{step.description}</StepTitle>
							{stepIdx === 0 && step.qty === 1 && step.type === Metric.COMPLEX && (
								<Heading size="md" mt="0.5em" mb="1em">
									1 Containing Box
								</Heading>
							)}
							{(stepIdx > 0 || step.qty !== 1 || step.type !== Metric.COMPLEX) && (
								<Flex>
									<NumberInput
										label="Quantity"
										min={0}
										precision={step.type === Metric.ML ? 2 : 0}
										defaultValue={step.qty}
										width="40%"
										marginRight="0.6em"
										valueConsumer={value => {
											if (value.isValid && value.value !== undefined) {
												updateStepQty(stepIdx, value.value)
											}
										}}
									/>
									<SelectInput
										label="Unit of Measure"
										placeholder="Choose a Unit"
										values={measures}
										defaultValue={step.type}
										width="30%"
										valueConsumer={value => {
											if (value.isValid && !!value.value) {
												updateSteps(stepIdx, value.value.value)
											}
										}}
									/>
								</Flex>
							)}
						</Box>
						<StepSeparator />
					</Step>
				))}
			</Stepper>
		</FormControl>
	)
}
