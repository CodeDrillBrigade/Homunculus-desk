import { Permissions } from '../security/Permissions'

export interface Role {
	_id: string
	name: string
	description: string
	permissions: Permissions[]
}
