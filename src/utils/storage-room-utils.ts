import { StorageRoom } from '../models/StorageRoom'

export function readableNameFromId(rooms: StorageRoom[], fullShelfId: string): string {
	const [roomId, cabinetId, shelfId] = fullShelfId.split('|')
	const room = rooms.find(it => it._id === roomId)
	const cabinet = !!room ? room.cabinets?.find(it => it.id === cabinetId) : undefined
	const shelf = !!cabinet ? cabinet.shelves?.find(it => it.id === shelfId) : undefined
	return `${room?.name ?? 'Unknown room'}, ${cabinet?.name ?? 'Unknown cabinet'}, ${shelf?.name ?? 'Unknown shelf'}`
}
