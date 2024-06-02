import { Material } from '../../models/Material'

export type MaterialTag = { type: typeof MaterialTagType; id: string }
export const MaterialTagType = 'Material'
export const AllMaterialsTag = { type: 'Material' as const, id: 'All' }

export const materialTagProvider: (materials: Material[] | undefined) => MaterialTag[] = materials =>
	!!materials
		? [
				...materials.map(material => {
					return { type: MaterialTagType, id: material._id } as {
						type: typeof MaterialTagType
						id: string
					}
				}),
				AllMaterialsTag,
		  ]
		: [AllMaterialsTag]
