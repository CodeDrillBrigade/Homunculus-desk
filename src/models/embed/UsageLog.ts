import { Operation } from './Operation'
import { BoxUnit } from './BoxUnit'

export interface UsageLog {
	date: number
	user: string
	operation: Operation
	quantity: BoxUnit
}
