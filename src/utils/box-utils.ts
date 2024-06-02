import { UnitStep } from '../models/embed/UnitStep'

export function computeTotal(steps: UnitStep[], quantities: number[]): number {
	let total = 0
	for (let i = 0; i < steps.length - 1; i++) {
		total = total * steps[i + 1].qty + (quantities[i] ?? 0) * steps[i + 1].qty
	}
	return total + (quantities[steps.length - 1] ?? 0)
}
