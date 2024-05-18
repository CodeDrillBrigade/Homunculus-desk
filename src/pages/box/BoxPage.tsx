import { AddBoxForm } from '../../components/box/AddBoxForm'
import { useAppDispatch } from '../../hooks/redux'
import { setPageTitle } from '../../store/ui/ui-slice'
import { useEffect } from 'react'

export const BoxPage = () => {
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(setPageTitle('Add a new Box'))
	}, [dispatch])
	return <AddBoxForm marginLeft="1em" marginRight="1em" />
}
