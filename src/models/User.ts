import { Contact } from './embed/Contact'

export interface User {
	_id: string
	username: string
	name: string
	surname: string
	roles: string[]
	contacts: Contact[]
}
