import { useParams } from 'react-router-dom'
import { useGetStorageRoomsQuery } from '../../services/storageRoom'
import { ErrorPage } from '../../components/errors/ErrorPage'
import { ShelvesDisplayBig } from '../../components/storage-rooms/ShelvesDisplayBig'
import { useAppDispatch } from '../../hooks/redux'
import { setPageTitle } from '../../store/ui/ui-slice'
import { useEffect } from 'react'
import { useIsMobileLayout } from '../../hooks/responsive-size'
import { ShelvesDisplayMobile } from '../../components/storage-rooms/ShelvesDisplayMobile'

export const CabinetPage = () => {
	const dispatch = useAppDispatch()
	const isMobile = useIsMobileLayout()
	const { roomId, cabinetId } = useParams()
	const { data, error, isFetching } = useGetStorageRoomsQuery()
	const room = !!data ? data.find(it => it._id === roomId) : undefined
	const cabinet = !!room ? room.cabinets?.find(it => it.id === cabinetId) : undefined
	useEffect(() => {
		dispatch(setPageTitle(cabinet?.name ?? 'Cabinet'))
	}, [cabinet?.name, dispatch])
	return (
		<>
			{(!cabinetId || (!isFetching && !cabinet)) && <ErrorPage description={`Shelf ${cabinetId} not found`} />}
			{!!error && <ErrorPage description="An error occurred" error={error} />}
			{!!cabinet && !!room && !isMobile && <ShelvesDisplayBig cabinet={cabinet} roomId={room._id!} />}
			{!!cabinet && !!room && isMobile && <ShelvesDisplayMobile cabinet={cabinet} roomId={room._id!} />}
		</>
	)
}
