import { Filter } from './Filter'

export interface NotFilter extends Filter {
	filter: Filter
	type: 'org.cdb.homunculus.models.filters.NotFilter'
}
