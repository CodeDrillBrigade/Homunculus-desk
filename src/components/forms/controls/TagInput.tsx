import {
	FormControl,
	FormLabel,
	Input,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	SpaceProps,
	useDisclosure,
	Tag as TagComponent,
	TagLabel,
	TagCloseButton,
	Text,
	Button,
	Flex,
	PopoverFooter,
	useBreakpointValue,
	Icon,
	VStack,
} from '@chakra-ui/react'
import { FormValue } from '../../../models/form/FormValue'
import { Tag } from '../../../models/embed/Tag'
import { generateSkeletons } from '../../ui/StackedSkeleton'
import { useCreateTagMutation, useGetTagsQuery, useLazyGetTagsByIdsQuery } from '../../../services/tag'
import React, { useEffect, useState } from 'react'
import { ErrorAlert } from '../../errors/ErrorAlert'
import { makeDarker } from '../../../utils/style-utils'
import { chunkArray } from '../../../utils/array-utils'
import { FormControls, useFormControl } from '../../../hooks/form-control'
import { Plus } from '@phosphor-icons/react'
import { AddTagModal } from '../../modals/AddTagModal'

export type Size = 'sm' | 'md' | 'lg' | 'xl' | 'base'

const tagsForSize: Record<Size, { tags: number }> = {
	xl: { tags: 10 },
	lg: { tags: 8 },
	md: { tags: 6 },
	sm: { tags: 3 },
	base: { tags: 3 },
}

interface LabelInputProps extends SpaceProps {
	label: string
	defaultValue?: Tag[]
	defaultIds?: string[]
	forcedSize?: number
	validator?: (input?: Tag[]) => boolean
	valueConsumer?: (value: FormValue<Tag[]>) => void
	invalidLabel?: string
	controls?: FormControls<Tag[]>
	allowCreation?: boolean
}

export const TagInput = ({
	label,
	defaultValue,
	defaultIds,
	validator,
	valueConsumer,
	invalidLabel,
	controls,
	forcedSize,
	allowCreation,
	...style
}: LabelInputProps) => {
	const { value, setValue } = useFormControl<Tag[]>({ validator, valueConsumer, defaultValue })
	const size = useBreakpointValue<{ tags: number }>(tagsForSize, {
		fallback: 'md',
	})

	const [createTag, { isLoading: createLoading, error: createError, isSuccess: createSuccess, reset: createReset }] =
		useCreateTagMutation()

	const { isOpen, onOpen: popoverOpen, onClose: popoverClose } = useDisclosure()
	const { isOpen: modalIsOpen, onOpen: modalOpen, onClose: modalClose } = useDisclosure()
	const { data: tags, error, isFetching } = useGetTagsQuery()
	const [getTagsByIds] = useLazyGetTagsByIdsQuery()
	const [filteredTags, setFilteredTags] = useState<Tag[]>([])
	const [inputValue, setInputValue] = useState<string>('')
	const [darkColors, setDarkColors] = useState<{ [key: string]: string }>({})
	const selectedTags = controls?.value ?? value
	const setSelectedTags = controls?.setValue ?? setValue

	useEffect(() => {
		const getTagsAsync = async () => {
			if (!!defaultIds && defaultIds.length > 0) {
				await getTagsByIds(defaultIds)
					.unwrap()
					.then(tags => {
						setSelectedTags(tags)
					})
			}
		}
		getTagsAsync()
	}, [])

	useEffect(() => {
		if (!!tags) {
			setFilteredTags(tags)
			setInputValue('')
			setDarkColors(Object.fromEntries(tags.map(it => [it.color, makeDarker(it.color)])))
		}
	}, [tags])

	const filterEntities = (value: string) => {
		const query = value.toLowerCase().trim()
		const queryResult = query.length > 0 ? tags?.filter(t => t.name.toLowerCase().startsWith(query)) : tags
		setInputValue(value)
		setFilteredTags(queryResult ?? [])
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		popoverOpen()
		filterEntities(event.target.value)
	}

	const handleSelection = (tagId: string | undefined) => {
		popoverClose()
		const tag = tags?.find(it => it._id === tagId)
		if (!!tag) {
			setSelectedTags(currentTags => {
				if (currentTags?.includes(tag) === true) {
					return currentTags
				} else {
					return [...(currentTags ?? []), tag]
				}
			})
		}
		setInputValue('')
		setFilteredTags(tags ?? [])
	}

	const handleTagRemoval = (tagId: string | undefined) => {
		if (!!tagId) {
			setSelectedTags(currentTags => (currentTags ?? []).filter(it => it._id !== tagId))
		}
	}

	const chunkedTags = !!tags ? chunkArray(filteredTags, size?.tags ?? 5) : undefined
	const chunkSelected = chunkArray(selectedTags?.value ?? [], forcedSize ?? size?.tags ?? 5)
	return (
		<FormControl {...style}>
			<AddTagModal
				action={tag => createTag(tag)}
				isSuccessful={createSuccess}
				isLoading={createLoading}
				reset={createReset}
				error={createError}
				isOpen={modalIsOpen}
				onClose={modalClose}
			/>
			<FormLabel color={selectedTags.isValid ? '' : 'red'}>{label}</FormLabel>
			<Popover
				closeOnBlur={false}
				closeOnEsc={true}
				isOpen={isOpen}
				onOpen={popoverOpen}
				onClose={popoverClose}
				autoFocus={false}
			>
				<PopoverTrigger>
					<Input
						placeholder="Search or create a Tag"
						value={inputValue}
						onChange={handleChange}
						onBlur={popoverClose}
						borderColor={selectedTags.isValid ? '' : 'red'}
						borderWidth={selectedTags.isValid ? '' : '2px'}
					/>
				</PopoverTrigger>
				{!selectedTags.isValid && !!invalidLabel && (
					<Text fontSize="sm" color="red">
						{invalidLabel}
					</Text>
				)}
				<PopoverContent width="100%">
					<PopoverBody>
						{!!chunkedTags &&
							chunkedTags.map((chunk, idx) => (
								<Flex key={`tag-flex-${idx}`} marginBottom="0.6em">
									{chunk.map(it => (
										<TagComponent
											key={it._id}
											borderRadius="full"
											bg={it.color}
											_hover={{ bg: darkColors[it.color], cursor: 'pointer' }}
											onClick={() => {
												handleSelection(it._id)
											}}
											marginLeft="0.6em"
										>
											<TagLabel>{it.name}</TagLabel>
										</TagComponent>
									))}
								</Flex>
							))}
						{isFetching && generateSkeletons({ quantity: 5, height: '1.5ex' })}
						{!!error && <ErrorAlert info={{ label: 'Cannot load labels', reason: error }} />}
					</PopoverBody>
					{(allowCreation === undefined || allowCreation) && (
						<PopoverFooter>
							{!!tags && (
								<Button
									colorScheme="blue"
									leftIcon={<Icon as={Plus} weight="bold" boxSize={6} />}
									onClick={modalOpen}
								>
									Add Tag
								</Button>
							)}
						</PopoverFooter>
					)}
				</PopoverContent>
				<Flex padding="0.6em" margin="0px">
					<VStack align="stretch">
						{chunkSelected.map((chunk, idx) => (
							<Flex key={`tag-selected-flex-${idx}`} marginBottom="0.6em" align="center" justify="start">
								{chunk.map(it => (
									<TagComponent
										size="md"
										key={it._id}
										borderRadius="full"
										variant="solid"
										bg={it.color}
										marginLeft="0.6em"
									>
										<TagLabel>{it.name}</TagLabel>
										<TagCloseButton onClick={() => handleTagRemoval(it._id)} />
									</TagComponent>
								))}
							</Flex>
						))}
					</VStack>
				</Flex>
			</Popover>
		</FormControl>
	)
}
