import { Note } from './embed/Note'

export interface Material {
	_id: string
	name: string
	boxDefinition: string
	brand: string
	referenceCode: string
	description?: string
	tags?: string[]
	noteList?: Note[]
}
