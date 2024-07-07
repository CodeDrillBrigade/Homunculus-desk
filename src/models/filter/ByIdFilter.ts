import { Filter } from './Filter'

export interface ByIdFilter extends Filter {
	id: string
	type: 'org.cdb.homunculus.models.filters.ByIdFilter'
}
