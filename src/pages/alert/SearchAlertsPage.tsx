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
	Spinner,
	VStack,
} from '@chakra-ui/react'
import { ErrorAlert } from '../../components/errors/ErrorAlert'
import { StackedSkeleton } from '../../components/ui/StackedSkeleton'
import { SearchIcon } from '@chakra-ui/icons'
import { useAlertPrefetch, useGetAlertsByIdsQuery, useSearchIdsByNameQuery } from '../../services/alert'
import { getIdsInPage } from '../../utils/array-utils'
import { PageControls } from '../../components/ui/PageControls'
import { AlertCard } from '../../components/models/AlertCard'

export const SearchAlertsPage = () => {
	const isMobile = useIsMobileLayout()
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(setPageTitle('Search Alerts'))
	}, [dispatch])

	const pageSize = 10
	const sideMargin = isMobile ? '0.5em' : '2em'

	const prefetchAlertsByIds = useAlertPrefetch('getAlertsByIds')
	const [currentPage, setCurrentPage] = useState<number>(0)
	const [isTyping, setIsTyping] = useState<boolean>(false)
	const [rawQuery, setRawQuery] = useState<string>('')
	const [query, setQuery] = useState<string>('')

	const { data: alertIds, error: idsError, isLoading: idsLoading } = useSearchIdsByNameQuery(query)

	const {
		data: alerts,
		error: alertsError,
		isLoading: alertsLoading,
	} = useGetAlertsByIdsQuery(getIdsInPage(alertIds, currentPage, pageSize), {
		skip: !alertIds || getIdsInPage(alertIds, currentPage, pageSize).length === 0,
	})

	const prefetchNextPage = useCallback(() => {
		const nextIds = getIdsInPage(alertIds, currentPage + 1, pageSize)
		if (nextIds.length > 0) {
			prefetchAlertsByIds(nextIds)
		}
	}, [alertIds, currentPage, prefetchAlertsByIds])

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
					id="material-search-bar"
					placeholder="Search alerts by name"
					minWidth="75vw"
					onChange={onSearchBarChange}
				/>
				{isTyping && (
					<InputRightElement>
						<Spinner />
					</InputRightElement>
				)}
			</InputGroup>
			{!!idsError && (
				<ErrorAlert
					info={{ label: 'An error occurred while retrieving the alerts', reason: idsError }}
					w="50%"
				/>
			)}
			{!idsError && !!alertIds && alertIds.length === 0 && (
				<Center>
					<Alert status="warning" w="50%">
						<AlertIcon />
						There are no alerts matching your search
					</Alert>
				</Center>
			)}
			{!!alertsError && (
				<ErrorAlert
					info={{ label: 'An error occurred while retrieving the materials', reason: alertsError }}
					w="50%"
				/>
			)}
			{(idsLoading || alertsLoading) && <StackedSkeleton quantity={5} height="3em" />}
			{!!alerts &&
				alerts.length > 0 &&
				!!alertIds &&
				alertIds.length > 0 &&
				alerts.map(it => <AlertCard key={it._id} alert={it} />)}
			<Center>
				<PageControls
					hasNext={getIdsInPage(alertIds, currentPage, pageSize).length >= pageSize}
					currentPage={currentPage + 1}
					increasePage={() => setCurrentPage(currentPage + 1)}
					decreasePage={() => setCurrentPage(currentPage - 1)}
					onNextEnter={prefetchNextPage}
				/>
			</Center>
		</VStack>
	)
}
