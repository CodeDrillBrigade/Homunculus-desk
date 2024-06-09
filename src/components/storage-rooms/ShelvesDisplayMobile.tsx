import { ShelvesDisplayProps } from './ShelvesDisplayBig'
import {
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	useDisclosure,
	VStack,
	Text,
	IconButton,
	Spacer,
} from '@chakra-ui/react'
import { ShelfListItem } from './ShelfListItem'
import { AddShelfForm } from '../forms/AddShelfForm'
import React, { useState } from 'react'
import { Shelf } from '../../models/embed/storage/Shelf'
import { useGetBoxByPositionQuery } from '../../services/box'
import { Box } from '../../models/Box'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { ErrorAlert } from '../errors/ErrorAlert'
import { generateSkeletons } from '../ui/StackedSkeleton'
import { ElementBox } from '../models/ElementBox'
import { AddBoxFormModal } from '../modals/AddBoxFormModal'
import { readableNameFromId } from '../../utils/storage-room-utils'
import { NoBoxesWarning } from '../errors/NoBoxesWarning'
import { AddIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons'

export const ShelvesDisplayMobile = ({ cabinet, room }: ShelvesDisplayProps) => {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [selectedShelf, setSelectedShelf] = useState<Shelf | undefined>(undefined)
	const { isOpen: addBoxIsOpen, onOpen: onOpenAddBox, onClose: onCloseAddBox } = useDisclosure()
	const { data, error, isLoading } = useGetBoxByPositionQuery(`${room._id}|${cabinet.id}|${selectedShelf?.id}`, {
		skip: !selectedShelf,
	})
	return (
		<>
			<VStack>
				{(cabinet.shelves ?? []).map(it => (
					<ShelfListItem
						key={it.id}
						shelf={it}
						onClick={() => {
							setSelectedShelf(it)
							onOpen()
						}}
					/>
				))}
				<AddShelfForm key="add-shlf-frm" cabinetId={cabinet.id!} storageRoomId={room._id} />
			</VStack>
			{!!selectedShelf && (
				<BoxesDrawer
					shelfName={selectedShelf.name}
					isOpen={isOpen}
					onClose={onClose}
					boxes={data}
					boxesError={error}
					boxesLoading={isLoading}
					onAddClick={onOpenAddBox}
				/>
			)}
			<AddBoxFormModal
				onClose={onCloseAddBox}
				isOpen={addBoxIsOpen}
				position={
					!!selectedShelf
						? {
								id: `${room._id}|${cabinet.id}|${selectedShelf.id}`,
								name: readableNameFromId([room], `${room._id}|${cabinet.id}|${selectedShelf.id}`),
						  }
						: undefined
				}
			/>
		</>
	)
}

interface BoxesDrawerProps {
	shelfName: string
	isOpen: boolean
	onClose: () => void
	onAddClick: () => void
	boxes: Box[] | undefined
	boxesError: FetchBaseQueryError | SerializedError | undefined
	boxesLoading: boolean
}

const BoxesDrawer = ({ shelfName, isOpen, onClose, boxes, boxesLoading, boxesError, onAddClick }: BoxesDrawerProps) => {
	return (
		<Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerHeader>
					<Flex width="full" justifyContent="space-between">
						{!!boxes && boxes.length > 0 && (
							<IconButton
								onClick={onAddClick}
								aria-label="add box"
								icon={<AddIcon />}
								colorScheme="green"
								borderRadius="full"
							/>
						)}
						<Text pt="0.3em">{shelfName}</Text>
						<IconButton onClick={onClose} aria-label="close drawer" icon={<CloseIcon />} variant="ghost" />
					</Flex>
				</DrawerHeader>

				<DrawerBody>
					<VStack>
						{!!boxesError && <ErrorAlert info={{ label: 'Cannot load the boxes', reason: boxesError }} />}
						{boxesLoading && generateSkeletons({ quantity: 3, minWidth: '90%', height: '5em' })}
						{!!boxes &&
							boxes.length > 0 &&
							boxes.map(box => <ElementBox key={box._id} box={box} width="100%" />)}
						{!!boxes && boxes.length === 0 && <NoBoxesWarning onClick={onAddClick} />}
					</VStack>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	)
}
