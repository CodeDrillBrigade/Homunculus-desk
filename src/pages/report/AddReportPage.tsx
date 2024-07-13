import { useAppDispatch } from '../../hooks/redux'
import { useEffect } from 'react'
import { setPageTitle } from '../../store/ui/ui-slice'
import { useCreateReportMutation } from '../../services/report'
import { AddReportForm } from '../../components/forms/AddReportForm'

export const AddReportPage = () => {
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(setPageTitle('Create a Report'))
	}, [dispatch])

	const [createReport, { error, isLoading, isSuccess, reset: resetMutation }] = useCreateReportMutation()

	return (
		<AddReportForm
			submitAction={createReport}
			submitError={error}
			submitIsLoading={isLoading}
			submitSuccess={isSuccess}
			reset={resetMutation}
			buttonLabel="Create"
		/>
	)
}
