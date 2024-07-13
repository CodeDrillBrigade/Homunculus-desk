import { Filter } from './Filter'

export interface ByNameFilter extends Filter {
	name: string
	type: 'org.cdb.homunculus.models.filters.ByNameFilter'
}
