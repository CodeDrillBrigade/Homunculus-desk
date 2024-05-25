import { UsageLog } from './embed/UsageLog'
import { BoxUnit } from './embed/BoxUnit'

export interface Box {
	_id: string
	material: string
	quantity: BoxUnit
	position: string
	batchNumber?: string
	expirationDate?: number
	deleted?: number
	description?: string
	usageLogs: UsageLog[]
}
