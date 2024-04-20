import { BoxUnit } from './embed/BoxUnit'
import { UsageLog } from './embed/UsageLog'

export interface Box {
	_id?: string
	material: string
	quantity: BoxUnit
	position: string
	expirationDate?: number
	description?: string
	usageLogs: UsageLog[]
}
