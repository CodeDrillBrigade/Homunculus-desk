import { useAppDispatch } from '../../hooks/redux'
import React, { useCallback, useEffect, useState } from 'react'
import { setPageTitle } from '../../store/ui/ui-slice'
import { useIsMobileLayout } from '../../hooks/responsive-size'
import {
	Alert,
	AlertIcon,
	Center,
	Input,
	InputGroup,
	InputLeftAddon,
	InputRightElement,
	SimpleGrid,
	Spinner,
	useBreakpointValue,
	VStack,
} from '@chakra-ui/react'
import { ErrorAlert } from '../../components/errors/ErrorAlert'
import { StackedSkeleton } from '../../components/ui/StackedSkeleton'
import { SearchIcon } from '@chakra-ui/icons'
import { getEntitiesInPage } from '../../utils/array-utils'
import { PageControls } from '../../components/ui/PageControls'
import { useGetUsersByUsernameEmailNameQuery } from '../../services/user'
import { UserCard } from '../../components/models/UserCard'
import { Size } from '../../components/forms/controls/TagInput'

const cardsForSize: Record<Size, { cards: number }> = {
	xl: { cards: 4 },
	lg: { cards: 3 },
	md: { cards: 2 },
	sm: { cards: 1 },
	base: { cards: 1 },
}

export const SearchUsersPage = () => {
	const isMobile = useIsMobileLayout()
	const size = useBreakpointValue<{ cards: number }>(cardsForSize, {
		fallback: 'md',
	})
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(setPageTitle('Search Users'))
	}, [dispatch])

	const pageSize = 40
	const sideMargin = isMobile ? '0.5em' : '2em'

	const [currentPage, setCurrentPage] = useState<number>(0)
	const [isTyping, setIsTyping] = useState<boolean>(false)
	const [rawQuery, setRawQuery] = useState<string>('')
	const [query, setQuery] = useState<string>('')

	const {
		data: users,
		error: usersError,
		isLoading: usersLoading,
	} = useGetUsersByUsernameEmailNameQuery({ query, onlyActive: false })
	const usersInPage = getEntitiesInPage(users, currentPage, pageSize)

	const onSearchBarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.trim().length > 0) {
			setRawQuery(e.target.value.trim())
		} else {
			setRawQuery('')
		}
	}, [])

	useEffect(() => {
		setIsTyping(true)
		const timeoutId = setTimeout(() => {
			setCurrentPage(0)
			setQuery(rawQuery)
			setIsTyping(false)
		}, 300)

		return () => clearTimeout(timeoutId)
	}, [rawQuery, setQuery, setIsTyping])

	return (
		<VStack alignItems="left" ml={sideMargin} mr={sideMargin}>
			<InputGroup>
				<InputLeftAddon>
					<SearchIcon />
				</InputLeftAddon>
				<Input
					id="user-search-bar"
					placeholder="Search users by username, email, name, or surname"
					minWidth="75vw"
					onChange={onSearchBarChange}
				/>
				{isTyping && (
					<InputRightElement>
						<Spinner />
					</InputRightElement>
				)}
			</InputGroup>
			{!!usersError && (
				<ErrorAlert
					info={{ label: 'An error occurred while retrieving the users', reason: usersError }}
					w="50%"
				/>
			)}
			{!usersError && !!users && users.length === 0 && (
				<Center>
					<Alert status="warning" w="50%">
						<AlertIcon />
						There are no users matching your search
					</Alert>
				</Center>
			)}
			{usersLoading && <StackedSkeleton quantity={5} height="3em" />}
			<SimpleGrid columns={size?.cards ?? 3} spacing={2}>
				{usersInPage.length > 0 && usersInPage.map(it => <UserCard key={it._id} user={it} />)}
			</SimpleGrid>
			<Center>
				<PageControls
					hasNext={usersInPage.length >= pageSize}
					currentPage={currentPage + 1}
					increasePage={() => setCurrentPage(currentPage + 1)}
					decreasePage={() => setCurrentPage(currentPage - 1)}
				/>
			</Center>
		</VStack>
	)
}
