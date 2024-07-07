import { Filter } from './Filter'

export interface AndFilter extends Filter {
	filters: Filter[]
	type: 'org.cdb.homunculus.models.filters.AndFilter'
}
