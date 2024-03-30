import {Cabinet} from "./embed/storage/Cabinet";

export interface StorageRoom {
	_id?: string,
	name: string,
	description?: string,
	cabinets?: Cabinet[],
}