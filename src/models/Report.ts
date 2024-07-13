import { ReportStatus } from './embed/ReportStatus'
import { Filter } from './filter/Filter'
import { ActivationMoment } from './embed/ActivationMoment'

export interface Report {
	_id: string
	name: string
	description?: string
	status: ReportStatus
	repeatAt: ActivationMoment[]
	timezone: string
	materialFilter: Filter
	excludeFilter?: Filter
	threshold: number
	recipients: string[]
	templateId?: String
}
