import { useAppDispatch } from '../hooks/redux'
import { useEffect } from 'react'
import { setPageTitle } from '../store/ui/ui-slice'
import { AddAlertForm } from '../components/forms/AddAlertForm'

export const AlertPage = () => {
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(setPageTitle('Create an Alert'))
	}, [dispatch])

	return <AddAlertForm />
}
