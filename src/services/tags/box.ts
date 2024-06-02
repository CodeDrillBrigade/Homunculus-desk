import { Box } from '../../models/Box'

export type BoxTag = { type: typeof BoxTagType | typeof BoxOnShelfType; id: string }
export const BoxTagType = 'Box'
export const BoxOnShelfType = 'BoxOnShelf'

export const boxTagProvider: (boxes: Box[] | undefined, shelfId: string) => BoxTag[] = (boxes, shelfId) =>
	!!boxes
		? [
				...boxes.map(box => {
					return { type: BoxTagType, id: box._id! } as { type: typeof BoxTagType; id: string }
				}),
				{ type: BoxOnShelfType, id: shelfId },
		  ]
		: [{ type: BoxOnShelfType, id: shelfId }]
