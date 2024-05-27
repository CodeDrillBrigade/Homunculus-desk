import {PERMISSIONS} from "./security/Permission";

export interface Role {
	_id: string,
	name: string,
	description: string,
	permissions: PERMISSIONS[]
}

