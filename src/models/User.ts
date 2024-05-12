import { UserStatus } from './embed/UserStatus'
import { AuthToken } from './security/AuthToken'

export interface User {
	_id: string
	username: string
	passwordHash?: string
	status?: UserStatus
	name?: string
	surname?: string
	roles: string[]
	email?: string
	authenticationTokens: { [key: string]: AuthToken }
}
