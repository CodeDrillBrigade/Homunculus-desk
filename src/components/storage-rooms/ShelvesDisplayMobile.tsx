import { ShelvesDisplayProps } from './ShelvesDisplayBig'
import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	Icon,
	IconButton,
	Text,
	useDisclosure,
	VStack,
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
import { Plus, X } from '@phosphor-icons/react'
import { useHasPermission } from '../../hooks/permissions'
import { Permissions } from '../../models/security/Permissions'

export const ShelvesDisplayMobile = ({ cabinet, room }: ShelvesDisplayProps) => {
	const hasPermission = useHasPermission()

	const { isOpen, onOpen, onClose } = useDisclosure()
	const [selectedShelf, setSelectedShelf] = useState<Shelf | undefined>(undefined)
	const { isOpen: addBoxIsOpen, onOpen: onOpenAddBox, onClose: onCloseAddBox } = useDisclosure()
	const { data, error, isLoading } = useGetBoxByPositionQuery(`${room._id}|${cabinet.id}|${selectedShelf?.id}`, {
		skip: !selectedShelf,
	})
	return (
		<>
			<VStack gap={3}>
				{(cabinet.shelves ?? []).map(it => (
					<ShelfListItem
						key={it.id}
						room={room}
						cabinet={cabinet}
						shelf={it}
						onClick={() => {
							setSelectedShelf(it)
							onOpen()
						}}
						width={hasPermission(Permissions.MANAGE_STORAGE) ? '90%' : '94.5%'}
						ml={hasPermission(Permissions.MANAGE_STORAGE) ? undefined : '0.5em'}
					/>
				))}
				{hasPermission(Permissions.MANAGE_STORAGE) && (
					<AddShelfForm key="add-shlf-frm" cabinetId={cabinet.id!} storageRoomId={room._id} />
				)}
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
	const hasPermission = useHasPermission()

	return (
		<Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerHeader>
					<Flex width="full" justifyContent="space-between">
						{!!boxes && boxes.length > 0 && hasPermission(Permissions.MANAGE_MATERIALS) && (
							<IconButton
								onClick={onAddClick}
								aria-label="add box"
								icon={<Icon as={Plus} weight="bold" boxSize={5} />}
								colorScheme="green"
								borderRadius="full"
							/>
						)}
						<Text pt="0.3em">{shelfName}</Text>
						<IconButton
							onClick={onClose}
							aria-label="close drawer"
							icon={<Icon as={X} weight="bold" boxSize={5} />}
							variant="ghost"
						/>
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
