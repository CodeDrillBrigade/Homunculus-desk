import { StorageRoom } from '../../models/StorageRoom'
import {
	Card,
	CardBody,
	CardHeader,
	Center,
	Flex,
	Heading,
	Icon,
	IconButton,
	LayoutProps,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	ResponsiveValue,
	SimpleGrid,
	SpaceProps,
	Text,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react'
import { CabinetCard } from './CabinetCard'
import {
	useAddCabinetMutation,
	useDeleteStorageRoomMutation,
	useModifyStorageRoomMutation,
} from '../../services/storageRoom'
import { TextWithDescriptionFormData, TextWithDescriptionModal } from '../forms/TextWithDescriptionModal'
import { QueryStatus } from '@reduxjs/toolkit/query'
import { AddIcon, EditIcon } from '@chakra-ui/icons'
import { borderDark, borderLight } from '../../styles/theme'
import { useIsMobileLayout } from '../../hooks/responsive-size'
import React, { useCallback } from 'react'
import { ConfirmModal } from '../modals/ConfirmModal'
import { ChangeStorageNameModal } from '../modals/ChangeStorageNameModal'
import { Door, DotsThreeVertical, Trash } from '@phosphor-icons/react'
import { useHasPermission } from '../../hooks/permissions'
import { Permissions } from '../../models/security/Permissions'

interface StorageRoomCardProps extends SpaceProps, LayoutProps {
	storageRoom: StorageRoom
}

export const StorageRoomCard = ({ storageRoom, ...style }: StorageRoomCardProps) => {
	const isMobile = useIsMobileLayout()
	const hasPermission = useHasPermission()
	const borderColor = useColorModeValue(borderLight, borderDark)
	const cabinets = storageRoom.cabinets ?? []
	const cardWidth: ResponsiveValue<string> = { lg: '17vw', md: '25vw', sm: '40vw' }

	const cabinetCardHeight = isMobile ? '15vh' : '15vh'

	const [deleteRoom, { isLoading: deleteIsLoading, error: deleteError }] = useDeleteStorageRoomMutation()
	const [modifyRoom, { isLoading: modifyIsLoading, error: modifyError, isSuccess: modifySuccess }] =
		useModifyStorageRoomMutation()

	const { isOpen: deleteModalIsOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
	const { isOpen: updateModalIsOpen, onOpen: onUpdateModalOpen, onClose: onUpdateModalClose } = useDisclosure()

	const onDeleteRoom = useCallback(() => {
		deleteRoom(storageRoom._id)
	}, [deleteRoom, storageRoom._id])

	const onModifyRoom = useCallback(
		(newName: string) => {
			modifyRoom({ ...storageRoom, name: newName })
		},
		[modifyRoom, storageRoom]
	)

	return (
		<Card {...style} bg="transparent" borderWidth="2px" borderColor={borderColor}>
			<CardHeader paddingBottom="0px">
				<Flex width="full" justifyContent="space-between">
					<Flex gap={2}>
						<Icon as={Door} boxSize={9} />
						<Heading size="lg"> {storageRoom.name}</Heading>
					</Flex>
					{hasPermission(Permissions.MANAGE_STORAGE) && (
						<Menu isLazy={true}>
							<MenuButton
								as={IconButton}
								aria-label="Options"
								icon={<Icon as={DotsThreeVertical} weight="bold" boxSize={6} />}
								variant="outline"
							/>
							<MenuList>
								<MenuItem icon={<EditIcon />} onClick={onUpdateModalOpen}>
									Change room name
								</MenuItem>
								<MenuItem
									icon={<Icon as={Trash} weight="bold" boxSize={5} />}
									onClick={onDeleteModalOpen}
								>
									Delete room
								</MenuItem>
							</MenuList>
						</Menu>
					)}
				</Flex>
				{!!storageRoom.description && <Text>{storageRoom.description}</Text>}
			</CardHeader>
			<CardBody>
				<SimpleGrid columns={{ lg: 5, md: 3, sm: 2 }} spacing={{ lg: 4, md: 3, sm: 3, base: 2 }}>
					{cabinets.map(it => (
						<CabinetCard
							key={it.id}
							cabinet={it}
							roomId={storageRoom._id!}
							height={cabinetCardHeight}
							width={cardWidth}
						/>
					))}
					{hasPermission(Permissions.MANAGE_STORAGE) && (
						<AddCabinetButton storageRoom={storageRoom} width={cardWidth} height={cabinetCardHeight} />
					)}
				</SimpleGrid>
			</CardBody>
			<ConfirmModal
				onClose={onDeleteModalClose}
				isOpen={deleteModalIsOpen}
				isLoading={deleteIsLoading}
				error={deleteError}
				flavour="delete"
				onConfirm={onDeleteRoom}
			/>
			<ChangeStorageNameModal
				onClose={onUpdateModalClose}
				isOpen={updateModalIsOpen}
				isLoading={modifyIsLoading}
				title="Change the shelf name"
				defaultValue={storageRoom.name}
				onConfirm={onModifyRoom}
				error={modifyError}
				isSuccess={modifySuccess}
			/>
		</Card>
	)
}

const AddCabinetButton = ({
	storageRoom,
	width,
	height,
}: {
	storageRoom: StorageRoom
	width: ResponsiveValue<string>
	height: string
}) => {
	const [addCabinet, { status, error }] = useAddCabinetMutation()
	const { isOpen, onOpen, onClose } = useDisclosure()

	const onSubmit = (formData: TextWithDescriptionFormData) => {
		const name = formData.name.value
		if (!name) {
			throw Error('Cabinet name is not valid')
		}
		if (!!storageRoom._id) {
			addCabinet({ storageRoomId: storageRoom._id, cabinet: { name, description: formData.description.value } })
		}
	}

	return (
		<>
			<TextWithDescriptionModal
				title="Add a Cabinet"
				isOpen={isOpen}
				onClose={onClose}
				onSubmit={onSubmit}
				isSubmitting={status === QueryStatus.pending}
				error={!!error ? { label: 'There was an creating the cabinet!', reason: error } : undefined}
				shouldClose={status === QueryStatus.fulfilled && !error}
			/>
			<Card width={width} height={height} _hover={{ cursor: 'pointer' }} onClick={() => onOpen()}>
				<CardBody>
					<Center paddingTop="1.5em">
						<AddIcon boxSize={10} />
					</Center>
				</CardBody>
			</Card>
		</>
	)
}
