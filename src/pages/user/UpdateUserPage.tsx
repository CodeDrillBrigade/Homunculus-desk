import { useAppDispatch } from '../../hooks/redux'
import { useEffect } from 'react'
import { setPageTitle } from '../../store/ui/ui-slice'
import { useGetCurrentUserQuery } from '../../services/user'
import { VStack } from '@chakra-ui/react'
import { generateSkeletons } from '../../components/ui/StackedSkeleton'
import { ErrorAlert } from '../../components/errors/ErrorAlert'
import { UpdateUserForm } from '../../components/forms/UpdateUserForm'

export const UpdateUserPage = () => {
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(setPageTitle('Update User'))
	}, [dispatch])

	const { data, error, isLoading } = useGetCurrentUserQuery(undefined)

	return (
		<>
			{isLoading && <VStack>{generateSkeletons({ quantity: 3, minWidth: '90vw', height: '5vh' })}</VStack>}
			{!!error && <ErrorAlert info={{ label: 'An error occurred while retrieving the user', reason: error }} />}
			{!!data && <UpdateUserForm user={data} />}
		</>
	)
}
