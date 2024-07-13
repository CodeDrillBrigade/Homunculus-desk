import { Filter } from '../filter/Filter'

export interface NotificationFilter {
	includeFilter: Filter
	excludeFilter?: Filter
}
