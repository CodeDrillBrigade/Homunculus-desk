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
import { SearchIcon } from '@chakra-ui/icons'
import { ErrorAlert } from '../../components/errors/ErrorAlert'
import { StackedSkeleton } from '../../components/ui/StackedSkeleton'
import { useGetTagsByIdsQuery, useSearchTagIdsByNameQuery } from '../../services/tag'
import { TagCard } from '../../components/models/TagCard'
import { Size } from '../../components/forms/controls/TagInput'

const cardsForSize: Record<Size, { cards: number }> = {
	xl: { cards: 5 },
	lg: { cards: 4 },
	md: { cards: 3 },
	sm: { cards: 1 },
	base: { cards: 1 },
}

export const SearchTagsPage = () => {
	const isMobile = useIsMobileLayout()
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(setPageTitle('Search Tags'))
	}, [dispatch])

	const size = useBreakpointValue<{ cards: number }>(cardsForSize, {
		fallback: 'md',
	})
	const sideMargin = isMobile ? '0.5em' : '2em'

	const [isTyping, setIsTyping] = useState<boolean>(false)
	const [rawQuery, setRawQuery] = useState<string>('')
	const [query, setQuery] = useState<string>('')

	const { data: tagIds, error: idsError, isLoading: idsLoading } = useSearchTagIdsByNameQuery(query)

	const {
		data: tags,
		error: tagsError,
		isLoading: tagsLoading,
	} = useGetTagsByIdsQuery(tagIds ?? [], {
		skip: !tagIds || tagIds.length === 0,
	})

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
					placeholder="Search tags by name"
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
			{!idsError && !!tagIds && tagIds.length === 0 && (
				<Center>
					<Alert status="warning" w="50%">
						<AlertIcon />
						There are no tags matching your search
					</Alert>
				</Center>
			)}
			{!!tagsError && (
				<ErrorAlert
					info={{ label: 'An error occurred while retrieving the tags', reason: tagsError }}
					w="50%"
				/>
			)}
			{(idsLoading || tagsLoading) && <StackedSkeleton quantity={5} height="3em" />}
			<SimpleGrid columns={size?.cards ?? 3} spacing={2}>
				{!!tags &&
					tags.length > 0 &&
					!!tagIds &&
					tagIds.length > 0 &&
					tags.map(it => <TagCard key={it._id} tag={it} />)}
			</SimpleGrid>
		</VStack>
	)
}
