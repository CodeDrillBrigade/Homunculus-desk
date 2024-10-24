import { Metric } from './Metric'
import React from 'react'
import { Icon } from '@chakra-ui/react'
import { PiFlask } from 'react-icons/pi'
import { BsBoxSeam } from 'react-icons/bs'
import { LuPipette } from 'react-icons/lu'
import { BoxUnit } from './BoxUnit'

export interface UnitStep {
	qty: number
	type: Metric
	description: string
	icon: React.JSX.Element
}

export const unitIcons: { [key in Metric]: React.JSX.Element } = {
	[Metric.ML]: <Icon as={PiFlask} />,
	[Metric.COMPLEX]: <Icon as={BsBoxSeam} />,
	[Metric.PIECE]: <Icon as={LuPipette} />,
}

export const generateDescription = (qty: number, type: Metric) => {
	switch (type) {
		case Metric.COMPLEX:
			if (qty === 1) return '1 Container'
			else return `${qty} Containers`
		case Metric.ML:
			return `Flask of ${qty} ml`
		case Metric.PIECE:
			if (qty === 1) return '1 Unit'
			else return `${qty} Units`
		default:
			return '??'
	}
}

export const generateLabel = (type: Metric) => {
	switch (type) {
		case Metric.COMPLEX:
			return 'Bag'
		case Metric.ML:
			return 'Flask'
		case Metric.PIECE:
			return 'Unit'
		default:
			return '??'
	}
}

export const defaultStep: UnitStep = {
	qty: 0,
	type: Metric.PIECE,
	description: generateDescription(0, Metric.PIECE),
	icon: unitIcons[Metric.PIECE],
}

export const firstStep: UnitStep = {
	qty: 1,
	type: Metric.COMPLEX,
	description: generateDescription(1, Metric.COMPLEX),
	icon: unitIcons[Metric.COMPLEX],
}

export function unitToStepsList(unit: BoxUnit | undefined, steps: UnitStep[] = []): UnitStep[] {
	if (!unit && steps.length === 0) {
		return [defaultStep]
	} else if (!unit) {
		return steps
	} else {
		const step: UnitStep = {
			qty: unit.quantity,
			type: unit.metric ?? Metric.COMPLEX,
			description: generateDescription(unit.quantity, unit.metric ?? Metric.COMPLEX),
			icon: unitIcons[unit.metric ?? Metric.COMPLEX],
		}
		return unitToStepsList(unit.boxUnit, steps.concat(step))
	}
}

export function stepsListToUnit(steps: UnitStep[]): BoxUnit | undefined {
	if (steps.length === 0) {
		return undefined
	}

	return {
		quantity: steps[0].qty,
		metric: steps[0].type !== Metric.COMPLEX ? steps[0].type : undefined,
		boxUnit: steps[0].type === Metric.COMPLEX ? stepsListToUnit(steps.slice(1, steps.length)) : undefined,
	}
}

export function describeStep(steps: UnitStep[], idx: number): string {
	const prevStep = steps[idx - 1]
	const step = steps[idx]
	const nextStep = steps[idx + 1]
	if (step.type === Metric.COMPLEX && nextStep?.type === Metric.COMPLEX) {
		return `Box of ${nextStep.qty} Bag${nextStep.qty > 1 ? 's' : ''}`
	} else if (step.type === Metric.COMPLEX && nextStep?.type === Metric.ML) {
		return `Full ${nextStep.qty} ml Flask`
	} else if (step.type === Metric.COMPLEX && nextStep?.type === Metric.PIECE) {
		if (!prevStep) {
			return `Full Box${nextStep.qty > 1 ? 'es' : ''} of ${nextStep.qty} pieces`
		} else {
			return `Full Bag${nextStep.qty > 1 ? 's' : ''} of ${nextStep.qty} pieces`
		}
	} else if (step.type === Metric.ML && !nextStep) {
		return `ml`
	} else if (step.qty === 1) {
		return `Single piece`
	} else {
		return `Single pieces`
	}
}
