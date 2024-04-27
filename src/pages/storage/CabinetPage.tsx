import { useParams } from 'react-router-dom'
import { useGetStorageRoomsQuery } from '../../services/storageRoom'
import { ErrorPage } from '../../components/errors/ErrorPage'
import { ShelvesDisplayBig } from '../../components/storage-rooms/ShelvesDisplayBig'

export const CabinetPage = () => {
	const { roomId, cabinetId } = useParams()
	const { data, error, isFetching } = useGetStorageRoomsQuery()
	const room = !!data ? data.find(it => it._id === roomId) : undefined
	const cabinet = !!room ? room.cabinets?.find(it => it.id === cabinetId) : undefined
	return (
		<>
			{(!cabinetId || (!isFetching && !cabinet)) && <ErrorPage description={`Shelf ${cabinetId} not found`} />}
			{!!error && <ErrorPage description="An error occurred" error={error} />}
			{!!cabinet && !!room && <ShelvesDisplayBig cabinet={cabinet} roomId={room._id!} />}
		</>
	)
}
