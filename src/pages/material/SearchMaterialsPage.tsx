import { useAppDispatch } from '../../hooks/redux'
import React, { useCallback, useEffect, useState } from 'react'
import { setPageTitle } from '../../store/ui/ui-slice'
import {
	Alert,
	AlertIcon,
	Button,
	Center,
	CloseButton,
	Container,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputLeftAddon,
	InputRightElement,
	Select,
	Skeleton,
	Spinner,
	Stack,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { useGetTagsQuery } from '../../services/tag'
import { Tag } from '../../models/embed/Tag'
import { SearchIcon } from '@chakra-ui/icons'
import {
	useGetMaterialsByIdsQuery,
	useMaterialPrefetch,
	useSearchIdsByNameBrandCodeQuery,
} from '../../services/material'
import { PageControls } from '../../components/ui/PageControls'
import { ErrorAlert } from '../../components/errors/ErrorAlert'
import { StackedSkeleton } from '../../components/ui/StackedSkeleton'
import { MaterialCard } from '../../components/models/MaterialCard'
import { useIsMobileLayout } from '../../hooks/responsive-size'
import { getIdsInPage } from '../../utils/array-utils'
import { getReportDownloadUrl } from '../../utils/url-utils'
import { FileXls } from '@phosphor-icons/react'
import { MaterialReportModal } from './MaterialReportModal'

export const SearchMaterialsPage = () => {
	const isMobile = useIsMobileLayout()
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(setPageTitle('Search Materials'))
	}, [dispatch])

	const pageSize = 10
	const sideMargin = isMobile ? '0.5em' : '2em'

	const prefetchMaterialsByIds = useMaterialPrefetch('getMaterialsByIds')
	const [currentPage, setCurrentPage] = useState<number>(0)
	const [tagFilter, setTagFilter] = useState<Tag | undefined>(undefined)
	const [rawQuery, setRawQuery] = useState<string>('')
	const [query, setQuery] = useState<string | undefined>(undefined)
	const [isTyping, setIsTyping] = useState<boolean>(false)
	const { isOpen: reportModalIsOpen, onOpen: reportModalOpen, onClose: onReportModalClose } = useDisclosure()

	const { data: tags, error: tagsError, isLoading: tagsLoading } = useGetTagsQuery()
	const {
		data: materialIds,
		error: idsError,
		isLoading: idsLoading,
	} = useSearchIdsByNameBrandCodeQuery({ query: query ?? '', tags: !!tagFilter ? [tagFilter] : null })
	const {
		data: materials,
		error: materialsError,
		isLoading: materialsLoading,
	} = useGetMaterialsByIdsQuery(getIdsInPage(materialIds, currentPage, pageSize), {
		skip: !materialIds || getIdsInPage(materialIds, currentPage, pageSize).length === 0,
	})
	const prefetchNextPage = useCallback(() => {
		const nextIds = getIdsInPage(materialIds, currentPage + 1, pageSize)
		if (nextIds.length > 0) {
			prefetchMaterialsByIds(nextIds)
		}
	}, [currentPage, materialIds, prefetchMaterialsByIds])

	const onTagChange = useCallback((tag?: Tag) => {
		setTagFilter(tag)
		setCurrentPage(0)
	}, [])

	const onSelectChange = useCallback(
		(event: React.ChangeEvent<HTMLSelectElement>) => {
			onTagChange(tags?.find(it => it._id === event.target.selectedOptions[0]?.id))
		},
		[onTagChange, tags]
	)

	const onChangeFilter = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
			if (rawQuery.length >= 2) {
				setQuery(rawQuery)
			} else if (rawQuery.length === 0) {
				setQuery(undefined)
			}
			setIsTyping(false)
		}, 300)

		return () => clearTimeout(timeoutId)
	}, [rawQuery, setQuery, setIsTyping])

	return (
		<VStack alignItems="left" ml={sideMargin} mr={sideMargin}>
			<Stack direction={{ base: 'column', sm: 'row' }}>
				{tagsLoading && (
					<Container minWidth="10vw">
						<Skeleton height="4vh" />
					</Container>
				)}
				{!!tagsError && (
					<Alert status="error" height="4.5vh">
						<AlertIcon />
						Cannot load tags
					</Alert>
				)}
				{!!tags && !tagFilter && (
					<Select placeholder="Filter by tag" id="tag-placeholder" onChange={onSelectChange}>
						{[...tags]
							.sort((a, b) => a.name.localeCompare(b.name))
							.map(it => (
								<option key={it._id} id={it._id}>
									{it.name}
								</option>
							))}
					</Select>
				)}
				{!!tags && !!tagFilter && (
					<Alert status="success" height="4.5vh" borderRadius="md">
						<CloseButton
							position="relative"
							left={-2}
							onClick={() => {
								onTagChange(undefined)
							}}
						/>
						{tags.find(it => it._id === tagFilter._id)?.name}
					</Alert>
				)}
				<InputGroup>
					<InputLeftAddon>
						<SearchIcon />
					</InputLeftAddon>
					<Input
						id="material-search-bar"
						placeholder="Search by name, brand, or reference number"
						minWidth="65vw"
						onChange={onChangeFilter}
					/>
					{isTyping && (
						<InputRightElement>
							<Spinner />
						</InputRightElement>
					)}
				</InputGroup>
				<IconButton
					colorScheme="green"
					aria-label="Download excel report"
					size="md"
					icon={<Icon as={FileXls} boxSize={7} />}
					onClick={reportModalOpen}
				/>
			</Stack>
			{!!idsError && (
				<ErrorAlert
					info={{ label: 'An error occurred while retrieving the materials', reason: idsError }}
					w="50%"
				/>
			)}
			{!idsError && materialIds === undefined && (
				<Center>
					<Alert status="info" w="50%">
						<AlertIcon />
						Select a tag or write a query to search.
					</Alert>
				</Center>
			)}
			{!idsError && !!materialIds && materialIds.length === 0 && (
				<Center>
					<Alert status="warning" w="50%">
						<AlertIcon />
						There are no materials matching your search
					</Alert>
				</Center>
			)}
			{!!materialsError && (
				<ErrorAlert
					info={{ label: 'An error occurred while retrieving the materials', reason: materialsError }}
					w="50%"
				/>
			)}
			{(idsLoading || materialsLoading) && <StackedSkeleton quantity={5} height="3em" />}
			{!!materials &&
				materials.length > 0 &&
				!!materialIds &&
				materialIds.length > 0 &&
				materials.map(it => <MaterialCard material={it} key={it._id} isCompact={false} />)}
			<Center>
				<PageControls
					hasNext={getIdsInPage(materialIds, currentPage, pageSize).length >= pageSize}
					currentPage={currentPage + 1}
					increasePage={() => setCurrentPage(currentPage + 1)}
					decreasePage={() => setCurrentPage(currentPage - 1)}
					onNextEnter={prefetchNextPage}
				/>
			</Center>
			<MaterialReportModal onClose={onReportModalClose} isOpen={reportModalIsOpen} />
		</VStack>
	)
}
