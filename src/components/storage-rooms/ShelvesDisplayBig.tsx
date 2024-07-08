import { Box, Button, Grid, GridItem, Heading, Icon, useDisclosure, VStack } from '@chakra-ui/react'
import { Cabinet } from '../../models/embed/storage/Cabinet'
import React, { useState } from 'react'
import { useGetBoxByPositionQuery } from '../../services/box'
import { ElementBox } from '../models/ElementBox'
import { generateSkeletons } from '../ui/StackedSkeleton'
import { ErrorAlert } from '../errors/ErrorAlert'
import { ShelfListItem } from './ShelfListItem'
import { AddShelfForm } from '../forms/AddShelfForm'
import { NoBoxesWarning } from '../errors/NoBoxesWarning'
import { AddBoxFormModal } from '../modals/AddBoxFormModal'
import { StorageRoom } from '../../models/StorageRoom'
import { readableNameFromId } from '../../utils/storage-room-utils'
import { Plus } from '@phosphor-icons/react'

export interface ShelvesDisplayProps {
	cabinet: Cabinet
	room: StorageRoom
}

export const ShelvesDisplayBig = ({ cabinet, room }: ShelvesDisplayProps) => {
	const [selectedShelf, setSelectedShelf] = useState<string | undefined>(undefined)
	const { data, error, isLoading } = useGetBoxByPositionQuery(selectedShelf ?? '', { skip: !selectedShelf })
	const { isOpen: addBoxIsOpen, onOpen: onOpenAddBox, onClose: onCloseAddBox } = useDisclosure()
	return (
		<Box paddingRight="1.5em" paddingLeft="1.5em">
			<Grid templateColumns="repeat(4, 1fr)" templateRows="repeat(1, 1fr)" gap={4} height="85vh">
				<GridItem colSpan={1} borderWidth="2px" borderRadius="15px">
					<VStack gap={3}>
						<Heading key="shlf-hdr">Shelves</Heading>
						{(cabinet.shelves ?? []).map(it => (
							<ShelfListItem
								key={it.id}
								room={room}
								cabinet={cabinet}
								shelf={it}
								onClick={() => {
									setSelectedShelf(`${room._id}|${cabinet.id}|${it.id}`)
								}}
								width="90%"
							/>
						))}
						<AddShelfForm key="add-shlf-frm" cabinetId={cabinet.id!} storageRoomId={room._id} />
					</VStack>
				</GridItem>
				<GridItem colSpan={3}>
					<VStack width="100%">
						{!!data && data.length > 0 && (
							<Button
								width="full"
								colorScheme="green"
								leftIcon={<Icon as={Plus} weight="bold" boxSize={5} />}
								onClick={onOpenAddBox}
							>
								Add a Box
							</Button>
						)}
						{!!data && data.length > 0 && data.map(it => <ElementBox key={it._id} box={it} width="100%" />)}
						{!!data && data.length === 0 && <NoBoxesWarning onClick={onOpenAddBox} />}
						{isLoading && generateSkeletons({ quantity: 5, height: '3em' })}
						{!!error && <ErrorAlert info={{ label: 'Cannot load boxes in this shelf', reason: error }} />}
					</VStack>
				</GridItem>
			</Grid>
			<AddBoxFormModal
				onClose={onCloseAddBox}
				isOpen={addBoxIsOpen}
				position={
					!!selectedShelf ? { id: selectedShelf, name: readableNameFromId([room], selectedShelf) } : undefined
				}
			/>
		</Box>
	)
}
