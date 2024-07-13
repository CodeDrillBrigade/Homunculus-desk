import {
	Box,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	Icon,
	IconButton,
	LayoutProps,
	SpaceProps,
	Text,
} from '@chakra-ui/react'
import { Filter } from '../../../models/filter/Filter'
import { FormValue } from '../../../models/form/FormValue'
import React, { useCallback, useState } from 'react'
import { TagInput } from './TagInput'
import { Material } from '../../../models/Material'
import { FormControls, useFormControl } from '../../../hooks/form-control'
import { MultipleMaterialNamesSelector } from './MultipleMaterialNamesSelector'
import { useFilterMaterialsQuery, useGetMaterialsByIdsQuery } from '../../../services/material'
import { ByTagsFilter } from '../../../models/filter/ByTagsFilter'
import { ByNameFilter } from '../../../models/filter/ByNameFilter'
import { OrFilter } from '../../../models/filter/OrFilter'
import { generateSkeletons } from '../../ui/StackedSkeleton'
import { ErrorAlert } from '../../errors/ErrorAlert'
import { ElementTag } from '../../models/ElementTag'
import { Plus, X } from '@phosphor-icons/react'
import { NotificationFilter } from '../../../models/form/NotificationFilter'
import { ByIdFilter } from '../../../models/filter/ByIdFilter'

interface MaterialFilterInputProps extends LayoutProps, SpaceProps {
	label: string
	validator?: (input?: NotificationFilter) => boolean
	valueConsumer?: (value: FormValue<NotificationFilter>) => void
	invalidLabel?: string
	controls?: FormControls<NotificationFilter>
	defaultValue?: NotificationFilter
}

function buildFilter(materialNames: string[], tags: string[]): Filter {
	const byTagsFilter =
		tags.length > 0
			? [
					{
						tagIds: tags,
						type: 'org.cdb.homunculus.models.filters.ByTagsFilter',
					} as Filter,
			  ]
			: []
	const byNameFilters =
		materialNames.length > 0
			? materialNames.map(it => {
					return {
						name: it,
						type: 'org.cdb.homunculus.models.filters.ByNameFilter',
					} as Filter
			  })
			: []
	return {
		filters: [...byNameFilters].concat(byTagsFilter),
		type: 'org.cdb.homunculus.models.filters.OrFilter',
	} as OrFilter
}

function buildExclusionFilter(exclusions: string[]): Filter | undefined {
	if (exclusions.length === 0) {
		return undefined
	}
	return {
		filters: exclusions.map(it => {
			return {
				id: it,
				type: 'org.cdb.homunculus.models.filters.ByIdFilter',
			} as ByIdFilter
		}),
		type: 'org.cdb.homunculus.models.filters.OrFilter',
	} as OrFilter
}

function extractExclusions(filter: NotificationFilter | undefined): string[] {
	if (!filter || !filter.excludeFilter || !('filters' in filter.excludeFilter)) {
		return []
	}
	const orFilter = filter.excludeFilter as OrFilter
	return orFilter.filters
		.filter(it => it.type === 'org.cdb.homunculus.models.filters.ByIdFilter')
		.map(it => {
			return (it as ByIdFilter).id
		})
}

function extractNames(filter: NotificationFilter | undefined): string[] {
	if (!filter || !('filters' in filter.includeFilter)) {
		return []
	}
	const orFilter = filter.includeFilter as OrFilter
	return orFilter.filters
		.filter(it => it.type === 'org.cdb.homunculus.models.filters.ByNameFilter')
		.map(it => {
			return (it as ByNameFilter).name
		})
}

function extractTags(filter: NotificationFilter | undefined): string[] {
	if (!filter || !('filters' in filter.includeFilter)) {
		return []
	}
	const orFilter = filter.includeFilter as OrFilter
	return orFilter.filters
		.filter(it => it.type === 'org.cdb.homunculus.models.filters.ByTagsFilter')
		.reduce((p, c) => {
			return [...p, ...(c as ByTagsFilter).tagIds]
		}, [] as string[])
}

export const MaterialFilterInput = ({
	label,
	validator,
	valueConsumer,
	invalidLabel,
	controls,
	defaultValue,
	...style
}: MaterialFilterInputProps) => {
	const { setValue } = useFormControl({ defaultValue, validator, valueConsumer })
	const setNotificationFilter = controls?.setValue ?? setValue

	const [selectedNames, setSelectedNames] = useState<string[]>(extractNames(controls?.value?.value ?? defaultValue))
	const [selectedTags, setSelectedTags] = useState<string[]>(extractTags(controls?.value?.value ?? defaultValue))
	const [excludedMaterials, setExcludedMaterials] = useState<string[]>(
		extractExclusions(controls?.value?.value ?? defaultValue)
	)
	const {
		data,
		error: filterError,
		isLoading: filterLoading,
	} = useFilterMaterialsQuery(buildFilter(selectedNames, selectedTags), {
		skip: selectedNames.length === 0 && selectedTags.length === 0,
	})
	const { data: excluded } = useGetMaterialsByIdsQuery(excludedMaterials, { skip: excludedMaterials.length === 0 })

	const updateMaterials = useCallback(
		(names: string[]) => {
			if (names.length > 0 || selectedTags.length > 0) {
				setNotificationFilter({
					includeFilter: buildFilter(names, selectedTags),
					excludeFilter: buildExclusionFilter(excludedMaterials),
				})
			} else {
				setNotificationFilter(undefined)
			}
		},
		[excludedMaterials, selectedTags, setNotificationFilter]
	)

	const updateTags = useCallback(
		(tags: string[]) => {
			if (selectedNames.length > 0 || tags.length > 0) {
				setNotificationFilter({
					includeFilter: buildFilter(selectedNames, tags),
					excludeFilter: buildExclusionFilter(excludedMaterials),
				})
			} else {
				setNotificationFilter(undefined)
			}
		},
		[excludedMaterials, selectedNames, setNotificationFilter]
	)

	const updateExclusions = useCallback(
		(exclusions: string[]) => {
			if (selectedNames.length > 0 || selectedTags.length > 0) {
				setNotificationFilter({
					includeFilter: buildFilter(selectedNames, selectedTags),
					excludeFilter: buildExclusionFilter(exclusions),
				})
			} else {
				setNotificationFilter(undefined)
			}
		},
		[selectedTags, selectedNames, setNotificationFilter]
	)

	const materials = !!data && (selectedNames.length > 0 || selectedTags.length > 0) ? data : []

	return (
		<FormControl {...style}>
			<FormLabel>{label}</FormLabel>
			<MultipleMaterialNamesSelector
				placeholder="Search by material"
				defaultValue={selectedNames}
				valueConsumer={data => {
					if (!!data.value) {
						setSelectedNames(data.value)
						updateMaterials(data.value)
					}
				}}
			/>
			<TagInput
				mt="0.5em"
				label="Search by tag"
				allowCreation={false}
				valueConsumer={data => {
					if (!!data.value) {
						setSelectedTags(data.value.map(it => it._id))
						updateTags(data.value.map(it => it._id))
					}
				}}
				defaultIds={selectedTags}
			/>
			<Flex width="full" justifyContent="space-between">
				{filterLoading && (
					<Flex direction="column" width="full" gap="1em">
						{generateSkeletons({ quantity: 3, height: '3em' })}
					</Flex>
				)}
				{!!filterError && (
					<ErrorAlert info={{ label: 'There was an error while filtering materials', reason: filterError }} />
				)}
				{!!materials && (
					<Flex direction="column" alignItems="flex-start" width="full">
						<Text fontSize="xl">Included Materials</Text>
						{materials
							.filter(it => !excludedMaterials.includes(it._id))
							.map(it => (
								<MaterialDisplay
									key={it._id}
									actionType="remove"
									material={it}
									onButtonClick={() => {
										setExcludedMaterials(materials => {
											if (!materials.includes(it._id)) {
												const newExclusions = [...materials, it._id]
												updateExclusions(newExclusions)
												return newExclusions
											} else {
												return materials
											}
										})
									}}
								/>
							))}
					</Flex>
				)}
				{!!materials && (
					<Flex direction="column" alignItems="flex-start" width="full">
						<Text fontSize="xl">Excluded Materials</Text>
						{excludedMaterials
							.flatMap(it => {
								const result = excluded?.find(itt => itt._id === it)
								return !!result ? [result] : []
							})
							.map(it => (
								<MaterialDisplay
									key={it._id}
									actionType="add"
									material={it}
									onButtonClick={() => {
										setExcludedMaterials(materials => {
											const newExclusions = materials.filter(m => m !== it._id)
											updateExclusions(newExclusions)
											return newExclusions
										})
									}}
								/>
							))}
					</Flex>
				)}
			</Flex>
		</FormControl>
	)
}

interface MaterialDisplayProps {
	material: Material
	actionType: 'add' | 'remove'
	onButtonClick: () => void
}

const MaterialDisplay = ({ material, actionType, onButtonClick }: MaterialDisplayProps) => {
	return (
		<Box width="full" mt="0.6em">
			<Flex justifyContent="flex-start" width="full">
				<IconButton
					colorScheme={actionType === 'add' ? 'green' : 'red'}
					aria-label="Exclude material"
					variant="outline"
					mr="0.6em"
					mt="0.2em"
					icon={<Icon as={actionType === 'add' ? Plus : X} weight="bold" boxSize={6} />}
					onClick={onButtonClick}
				/>
				<Flex _hover={{ cursor: 'pointer' }} direction="column" width="100%">
					<Flex>
						<Text>
							<b>{material.name}</b>, Brand: {material.brand}
							{!!material.referenceCode && ` - # ${material.referenceCode}`}
						</Text>
					</Flex>
					{!!material.tags && material.tags.length > 0 && (
						<Flex align="center" justify="start" mt="0.2em">
							{material.tags.map(id => (
								<ElementTag
									key={id}
									tagId={id}
									marginRight="0.4em"
									compact={!!material.tags && material.tags.length >= 5}
								/>
							))}
						</Flex>
					)}
				</Flex>
			</Flex>
			<Divider mt="0.5em" width="98%" />
		</Box>
	)
}
