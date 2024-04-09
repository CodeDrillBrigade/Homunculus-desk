
/*Interfaccia altrimenti rtk piange*/

import {Contact} from "./Contact";

export interface User{
	nome: string
	_id: string,
	username: string,
	passwordHash: string,
	name: string,
	surname: string,
	roles: string[],
	contacts: Contact[]
}


