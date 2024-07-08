import { useEffect } from 'react'
import { useAppDispatch } from '../../hooks/redux'
import { setPageTitle } from '../../store/ui/ui-slice'
import { AddAlertForm } from '../../components/forms/AddAlertForm'
import { useCreateAlertMutation } from '../../services/alert'

export const AlertPage = () => {
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(setPageTitle('Create an Alert'))
	}, [dispatch])

	const [createAlert, { error, isLoading, isSuccess, reset: resetMutation }] = useCreateAlertMutation()

	return (
		<AddAlertForm
			submitAction={createAlert}
			submitError={error}
			submitIsLoading={isLoading}
			submitSuccess={isSuccess}
			reset={resetMutation}
		/>
	)
}
