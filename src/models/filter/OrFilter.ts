import { Filter } from './Filter'

export interface OrFilter extends Filter {
	filters: Filter[]
	type: 'org.cdb.homunculus.models.filters.OrFilter'
}
