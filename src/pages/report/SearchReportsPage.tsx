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
import { getIdsInPage } from '../../utils/array-utils'
import { PageControls } from '../../components/ui/PageControls'
import { useGetReportsByIdsQuery, useReportPrefetch, useSearchReportIdsByNameQuery } from '../../services/report'
import { ReportCard } from '../../components/models/ReportCard'

export const SearchReportsPage = () => {
	const isMobile = useIsMobileLayout()
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(setPageTitle('Search Reports'))
	}, [dispatch])

	const pageSize = 10
	const sideMargin = isMobile ? '0.5em' : '2em'

	const prefetchReportsByIds = useReportPrefetch('getReportsByIds')
	const [currentPage, setCurrentPage] = useState<number>(0)
	const [isTyping, setIsTyping] = useState<boolean>(false)
	const [rawQuery, setRawQuery] = useState<string>('')
	const [query, setQuery] = useState<string>('')

	const { data: reportIds, error: idsError, isLoading: idsLoading } = useSearchReportIdsByNameQuery(query)

	const {
		data: reports,
		error: reportsError,
		isLoading: reportsLoading,
	} = useGetReportsByIdsQuery(getIdsInPage(reportIds, currentPage, pageSize), {
		skip: !reportIds || getIdsInPage(reportIds, currentPage, pageSize).length === 0,
	})

	const prefetchNextPage = useCallback(() => {
		const nextIds = getIdsInPage(reportIds, currentPage + 1, pageSize)
		if (nextIds.length > 0) {
			prefetchReportsByIds(nextIds)
		}
	}, [reportIds, currentPage, prefetchReportsByIds])

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
					id="report-search-bar"
					placeholder="Search reports by name"
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
					info={{ label: 'An error occurred while retrieving the reports', reason: idsError }}
					w="50%"
				/>
			)}
			{!idsError && !!reportIds && reportIds.length === 0 && (
				<Center>
					<Alert status="warning" w="50%">
						<AlertIcon />
						There are no reports matching your search
					</Alert>
				</Center>
			)}
			{!!reportsError && (
				<ErrorAlert
					info={{ label: 'An error occurred while retrieving the reports', reason: reportsError }}
					w="50%"
				/>
			)}
			{(idsLoading || reportsLoading) && <StackedSkeleton quantity={5} height="3em" />}
			{!!reports &&
				reports.length > 0 &&
				!!reportIds &&
				reportIds.length > 0 &&
				reports.map(it => <ReportCard key={it._id} report={it} />)}
			<Center>
				<PageControls
					hasNext={getIdsInPage(reportIds, currentPage, pageSize).length >= pageSize}
					currentPage={currentPage + 1}
					increasePage={() => setCurrentPage(currentPage + 1)}
					decreasePage={() => setCurrentPage(currentPage - 1)}
					onNextEnter={prefetchNextPage}
				/>
			</Center>
		</VStack>
	)
}
