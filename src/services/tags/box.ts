import { Box } from '../../models/Box'

export type BoxTag = { type: typeof BoxTagType | typeof BoxOnShelfType | typeof BoxWithMaterialType; id: string }
export const BoxTagType = 'Box'
export const BoxOnShelfType = 'BoxOnShelf'
export const BoxWithMaterialType = 'BoxWithMaterial'

export const boxTagOnShelfProvider: (boxes: Box[] | undefined, shelfId: string | undefined) => BoxTag[] = (
	boxes,
	shelfId
) =>
	!!boxes && !!shelfId
		? [
				...boxes.map(box => {
					return { type: BoxTagType, id: box._id! } as { type: typeof BoxTagType; id: string }
				}),
				{ type: BoxOnShelfType, id: shelfId },
		  ]
		: !!shelfId
		? [{ type: BoxOnShelfType, id: shelfId }]
		: []

export const boxTagWithMaterialProvider: (boxes: Box[] | undefined, materialId: string) => BoxTag[] = (
	boxes,
	materialId
) =>
	!!boxes
		? [
				...boxes.map(box => {
					return { type: BoxTagType, id: box._id! } as { type: typeof BoxTagType; id: string }
				}),
				{ type: BoxWithMaterialType, id: materialId },
		  ]
		: [{ type: BoxWithMaterialType, id: materialId }]
