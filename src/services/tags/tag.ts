import { Tag } from '../../models/embed/Tag'

export type TagTag = { type: typeof TagTagType; id: string }
export const TagTagType = 'Tag'
export const AllTags = { type: 'Tag' as const, id: 'All' }

export const metaTagTagProvider: (tags: Tag[] | undefined) => TagTag[] = tags =>
	!!tags
		? [
				...tags.map(tag => {
					return { type: TagTagType, id: tag._id! } as {
						type: typeof TagTagType
						id: string
					}
				}),
				AllTags,
		  ]
		: [AllTags]
