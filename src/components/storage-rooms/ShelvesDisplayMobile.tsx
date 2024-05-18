import { NoBoxesWarning, ShelvesDisplayProps } from './ShelvesDisplayBig'
import {
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { ShelfListItem } from './ShelfListItem'
import { AddShelfForm } from '../forms/AddShelfForm'
import { useState } from 'react'
import { Shelf } from '../../models/embed/storage/Shelf'
import { useGetBoxByPositionQuery } from '../../services/box'
import { Box } from '../../models/Box'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { ErrorAlert } from '../errors/ErrorAlert'
import { generateSkeletons } from '../ui/StackedSkeleton'
import { ElementBox } from '../models/ElementBox'

export const ShelvesDisplayMobile = ({ cabinet, roomId }: ShelvesDisplayProps) => {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [selectedShelf, setSelectedShelf] = useState<Shelf | undefined>(undefined)
	const { data, error, isLoading } = useGetBoxByPositionQuery(`${roomId}|${cabinet.id}|${selectedShelf?.id}`, {
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
				<AddShelfForm key="add-shlf-frm" cabinetId={cabinet.id!} storageRoomId={roomId} />
			</VStack>
			{!!selectedShelf && (
				<BoxesDrawer
					shelfName={selectedShelf.name}
					isOpen={isOpen}
					onClose={onClose}
					boxes={data}
					boxesError={error}
					boxesLoading={isLoading}
				/>
			)}
		</>
	)
}

interface BoxesDrawerProps {
	shelfName: string
	isOpen: boolean
	onClose: () => void
	boxes: Box[] | undefined
	boxesError: FetchBaseQueryError | SerializedError | undefined
	boxesLoading: boolean
}

const BoxesDrawer = ({ shelfName, isOpen, onClose, boxes, boxesLoading, boxesError }: BoxesDrawerProps) => {
	return (
		<Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>{shelfName}</DrawerHeader>

				<DrawerBody>
					<VStack>
						{!!boxesError && <ErrorAlert info={{ label: 'Cannot load the boxes', reason: boxesError }} />}
						{boxesLoading && generateSkeletons({ quantity: 3, minWidth: '90%', height: '5em' })}
						{!!boxes &&
							boxes.length > 0 &&
							boxes.map(box => <ElementBox key={box._id} box={box} width="100%" />)}
						{!!boxes && boxes.length === 0 && <NoBoxesWarning />}
					</VStack>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	)
}
