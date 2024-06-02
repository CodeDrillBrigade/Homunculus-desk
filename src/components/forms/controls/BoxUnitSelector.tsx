import {
	Button,
	Checkbox,
	FormControl,
	FormLabel,
	HStack,
	Input,
	LayoutProps,
	SpaceProps,
	Text,
} from '@chakra-ui/react'
import { FormValue } from '../../../models/form/FormValue'
import { BoxUnit } from '../../../models/embed/BoxUnit'
import React, { useCallback, useMemo, useState } from 'react'
import { describeStep, UnitStep, unitToStepsList } from '../../../models/embed/UnitStep'
import { useFormControl } from '../../../hooks/form-control'
import { HTMLChakraProps } from '@chakra-ui/system'
import { computeTotal } from '../../../utils/box-utils'

interface BoxUnitSelectorProps extends LayoutProps, SpaceProps, HTMLChakraProps<'div'> {
	boxUnit: BoxUnit
	label: string
	validator?: (input?: BoxUnit) => boolean
	valueConsumer?: (value: FormValue<BoxUnit>) => void
	invalidLabel?: string
}

export const BoxUnitSelector = ({
	boxUnit,
	label,
	validator,
	valueConsumer,
	invalidLabel,
	...style
}: BoxUnitSelectorProps) => {
	const unitSteps = useMemo(() => unitToStepsList(boxUnit), [boxUnit])
	const [stepValues, setStepValues] = useState<number[]>(
		unitSteps
			.slice(0, unitSteps.length - 1)
			.map(_ => 0)
			.concat([1])
	)
	const { value, setValue } = useFormControl<BoxUnit>({
		defaultValue: {
			quantity: computeTotal(
				unitSteps,
				unitSteps
					.slice(0, unitSteps.length - 1)
					.map(_ => 0)
					.concat([1])
			),
			metric: unitSteps[unitSteps.length - 1].type,
		},
		validator,
		valueConsumer,
	})
	const [isFullBox, setIsFullBox] = useState(false)

	const dispatchNewQuantity = useCallback(
		(qty: number[]) => {
			const quantity = computeTotal(unitSteps, qty)
			const metric = unitSteps[unitSteps.length - 1].type
			setValue({ quantity, metric })
		},
		[setValue, unitSteps]
	)

	const onIncrease = useCallback(
		(idx: number) => {
			setStepValues(previousState => {
				const newQty = increaseState(idx, previousState, unitSteps)
				dispatchNewQuantity(newQty)
				return newQty
			})
		},
		[dispatchNewQuantity, unitSteps]
	)

	const onDecrease = useCallback(
		(idx: number) => {
			setStepValues(previousState => {
				const newQty = decreaseState(idx, previousState, unitSteps)
				dispatchNewQuantity(newQty)
				return newQty
			})
		},
		[dispatchNewQuantity, unitSteps]
	)

	const onCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsFullBox(event.target.checked)
		const newState = unitSteps.map(_ => 0)
		newState[0] = unitSteps[0].qty
		setStepValues(newState)
	}

	return (
		<FormControl {...style}>
			<FormLabel color={value.isValid ? '' : 'red'}>{label}</FormLabel>
			<Checkbox onChange={onCheck}>Full box?</Checkbox>
			{!isFullBox &&
				unitSteps.map((step, idx) => (
					<FormControl key={idx} marginTop="0.7em">
						<FormLabel>
							{step.icon} {describeStep(step, unitSteps[idx + 1])}
						</FormLabel>
						<HStack>
							<Button onClick={() => onDecrease(idx)}>-</Button>
							<Input width="5em" type="number" value={stepValues[idx] ?? 0} readOnly />
							<Button onClick={() => onIncrease(idx)}>+</Button>
						</HStack>
					</FormControl>
				))}
			<Text marginTop="0.7em">
				Total: {computeTotal(unitSteps, stepValues)} {describeStep(unitSteps[unitSteps.length - 1], undefined)}
			</Text>
			{!value.isValid && !!invalidLabel && (
				<Text fontSize="sm" color="red">
					{invalidLabel}
				</Text>
			)}
		</FormControl>
	)
}

function increaseState(idx: number, state: number[], steps: UnitStep[]): number[] {
	if (state[0] === steps[0].qty) {
		const newState = state.map(_ => 0)
		newState[0] = state[0]
		return newState
	} else if (state[idx] === steps[idx].qty) {
		const newState = [...state]
		newState[idx] = 0
		return increaseState(idx - 1, newState, steps)
	} else {
		const newState = [...state]
		newState[idx] = newState[idx] + 1
		return newState
	}
}

function decreaseState(idx: number, state: number[], steps: UnitStep[]): number[] {
	if (idx === 0 && state[idx] === 0) {
		return state
	} else if (state[idx] === 0) {
		const newState = [...state]
		newState[idx] = steps[idx].qty - 1
		return decreaseState(idx - 1, newState, steps)
	} else {
		const newState = [...state]
		newState[idx] = newState[idx] - 1
		return newState
	}
}
