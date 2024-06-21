import { StorageRoom } from '../models/StorageRoom'

export function readableNameFromId(rooms: StorageRoom[], fullShelfId: string | undefined): string {
	if (!fullShelfId) {
		return 'Unknown room, cabinet, and shelf'
	}
	const [roomId, cabinetId, shelfId] = fullShelfId.split('|')
	const room = rooms.find(it => it._id === roomId)
	const cabinet = !!room ? room.cabinets?.find(it => it.id === cabinetId) : undefined
	const shelf = !!cabinet ? cabinet.shelves?.find(it => it.id === shelfId) : undefined
	return `${room?.name ?? 'Unknown room'}, ${cabinet?.name ?? 'Unknown cabinet'}, ${shelf?.name ?? 'Unknown shelf'}`
}
