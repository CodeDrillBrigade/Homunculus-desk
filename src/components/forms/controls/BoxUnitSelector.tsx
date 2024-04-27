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
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { describeStep, UnitStep, unitToStepsList } from '../../../models/embed/UnitStep'
import { Metric } from '../../../models/embed/Metric'
import { useFormControl } from '../../../hooks/form-control'
import { HTMLChakraProps } from '@chakra-ui/system'

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
	const { value, setValue } = useFormControl<BoxUnit>({ validator, valueConsumer })
	const unitSteps = useMemo(() => unitToStepsList(boxUnit), [boxUnit])
	const [stepValues, setStepValues] = useState<number[]>(unitSteps.map(_ => 0))
	const [isFullBox, setIsFullBox] = useState(false)

	useEffect(() => {
		const quantity = computeTotal(unitSteps, stepValues)
		const metric = unitSteps[unitSteps.length - 1].type
		setValue({ quantity, metric })
	}, [setValue, stepValues, unitSteps])

	const onIncrease = useCallback(
		(idx: number) => {
			setStepValues(previousState => increaseState(idx, previousState, unitSteps))
		},
		[unitSteps]
	)

	const onDecrease = useCallback(
		(idx: number) => {
			setStepValues(previousState => decreaseState(idx, previousState, unitSteps))
		},
		[unitSteps]
	)

	const onCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsFullBox(event.target.checked)
		const newState = unitSteps.map(_ => 0)
		newState[0] = unitSteps[0].qty
		setStepValues(newState)
	}

	return (
		<FormControl {...style}>
			<FormLabel color={value.isValid ? '' : 'crimson'}>{label}</FormLabel>
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
				<Text fontSize="sm" color="crimson">
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

function computeTotal(steps: UnitStep[], quantities: number[]): number {
	let total = 0
	for (let i = 0; i < steps.length - 1; i++) {
		total = total * steps[i + 1].qty + (quantities[i] ?? 0) * steps[i + 1].qty
	}
	return total + (quantities[steps.length - 1] ?? 0)
}
