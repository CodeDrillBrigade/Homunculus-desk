import { Shelf } from '../../models/embed/storage/Shelf'
import {
	Card,
	CardHeader,
	Flex,
	Heading,
	Icon,
	IconButton,
	SpaceProps,
	StyleProps,
	useDisclosure,
} from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { StorageRoom } from '../../models/StorageRoom'
import { useDeleteShelfMutation, useModifyShelfMutation } from '../../services/storageRoom'
import { ConfirmModal } from '../modals/ConfirmModal'
import { Cabinet } from '../../models/embed/storage/Cabinet'
import { ChangeStorageNameModal } from '../modals/ChangeStorageNameModal'
import { Dresser, PencilSimple, Trash } from '@phosphor-icons/react'
import { useHasPermission } from '../../hooks/permissions'
import { Permissions } from '../../models/security/Permissions'

interface ShelfListItemProps extends StyleProps, SpaceProps {
	room: StorageRoom
	cabinet: Cabinet
	shelf: Shelf
	onClick?: () => void
}

export const ShelfListItem = ({ room, shelf, cabinet, onClick, ...style }: ShelfListItemProps) => {
	const hasPermission = useHasPermission()
	const [deleteShelf, { isLoading: deleteIsLoading, error: deleteError }] = useDeleteShelfMutation()
	const [modifyShelf, { isLoading: modifyIsLoading, error: modifyError, isSuccess: modifySuccess }] =
		useModifyShelfMutation()

	const { isOpen: deleteModalIsOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
	const { isOpen: updateModalIsOpen, onOpen: onUpdateModalOpen, onClose: onUpdateModalClose } = useDisclosure()

	const onDeleteShelf = useCallback(() => {
		if (!cabinet.id) throw new Error('Invalid cabinet')
		if (!shelf.id) throw new Error('Invalid shelf')
		deleteShelf({ roomId: room._id, cabinetId: cabinet.id, shelfId: shelf.id })
	}, [cabinet.id, deleteShelf, room._id, shelf.id])

	const onModifyShelf = useCallback(
		(newName: string) => {
			if (!cabinet.id) throw new Error('Invalid cabinet')
			modifyShelf({ roomId: room._id, cabinetId: cabinet.id, shelf: { ...shelf, name: newName } })
		},
		[cabinet.id, modifyShelf, room._id, shelf]
	)

	return (
		<Flex {...style}>
			{hasPermission(Permissions.MANAGE_STORAGE) && (
				<Flex direction="column" mr={3} height="100%" gap={2}>
					<IconButton
						aria-label="Edit shelf name"
						icon={<Icon as={PencilSimple} weight="bold" boxSize={5} />}
						onClick={onUpdateModalOpen}
					/>
					<IconButton
						aria-label="Delete shelf"
						icon={<Icon as={Trash} weight="bold" boxSize={5} />}
						colorScheme="red"
						onClick={onDeleteModalOpen}
					/>
				</Flex>
			)}
			<Card boxShadow={0} borderWidth="2px" _hover={{ cursor: 'pointer' }} onClick={onClick} {...style}>
				<CardHeader>
					<Flex alignItems="center" gap="2">
						<Icon as={Dresser} weight="bold" boxSize={6} />
						<Heading size="md">{shelf.name}</Heading>
					</Flex>
				</CardHeader>
			</Card>
			<ConfirmModal
				onClose={onDeleteModalClose}
				isOpen={deleteModalIsOpen}
				isLoading={deleteIsLoading}
				error={deleteError}
				flavour="delete"
				onConfirm={onDeleteShelf}
			/>
			<ChangeStorageNameModal
				onClose={onUpdateModalClose}
				isOpen={updateModalIsOpen}
				isLoading={modifyIsLoading}
				title="Change the shelf name"
				defaultValue={shelf.name}
				onConfirm={onModifyShelf}
				error={modifyError}
				isSuccess={modifySuccess}
			/>
		</Flex>
	)
}
