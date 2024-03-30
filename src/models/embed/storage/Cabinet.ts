import {Shelf} from "./Shelf";

export interface Cabinet {
	id?: string,
	name: string,
	description?: string,
	shelves?: Shelf[],
}