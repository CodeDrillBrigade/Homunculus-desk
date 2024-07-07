import { ReportStatus } from './embed/ReportStatus'
import { WeekDay } from './embed/WeekDay'
import { Filter } from './filter/Filter'

export interface Report {
	_id: string
	name: string
	description?: string
	status: ReportStatus
	repeatOnDays: WeekDay[]
	repeatAtTime: number
	timezone: string
	materialFilter: Filter
	excludeFilter?: Filter
	threshold: number
	recipients: string[]
	templateId?: String
}
