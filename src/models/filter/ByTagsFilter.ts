import { Filter } from './Filter'

export interface ByTagsFilter extends Filter {
	tagIds: string[]
	type: 'org.cdb.homunculus.models.filters.ByTagsFilter'
}
