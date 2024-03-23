import {Cabinet} from "./embed/storage/Cabinet";

export interface StorageRoom {
	id?: string,
	name: string,
	description?: string,
	cabinets?: Cabinet[],
}