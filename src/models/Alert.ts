import { AlertStatus } from './embed/AlertStatus'
import { Filter } from './filter/Filter'

export interface Alert {
	_id: string
	name: string
	description?: string
	status: AlertStatus
	materialFilter: Filter
	excludeFilter?: Filter
	threshold: number
	recipients: string[]
	templateId?: string
}
