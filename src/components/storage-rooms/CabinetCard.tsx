import { Cabinet } from '../../models/embed/storage/Cabinet'
import {
	Card,
	CardBody,
	CardHeader,
	Flex,
	Heading,
	Icon,
	IconButton,
	LayoutProps,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	SpaceProps,
	Spacer,
	Text,
	useDisclosure,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import React, { useCallback } from 'react'
import { useDeleteCabinetMutation, useModifyCabinetMutation } from '../../services/storageRoom'
import { ConfirmModal } from '../modals/ConfirmModal'
import { ChangeStorageNameModal } from '../modals/ChangeStorageNameModal'
import { DotsThreeVertical, Lockers, PencilSimple, Trash } from '@phosphor-icons/react'
import { Permissions } from '../../models/security/Permissions'
import { useHasPermission } from '../../hooks/permissions'

interface CabinetCardProps extends SpaceProps, LayoutProps {
	cabinet: Cabinet
	roomId: string
}

export const CabinetCard = ({ cabinet, roomId, ...style }: CabinetCardProps) => {
	const navigate = useNavigate()
	const hasPermission = useHasPermission()

	const [deleteCabinet, { isLoading: deleteIsLoading, error: deleteError }] = useDeleteCabinetMutation()
	const [modifyCabinet, { isLoading: modifyIsLoading, error: modifyError, isSuccess: modifySuccess }] =
		useModifyCabinetMutation()

	const { isOpen: deleteModalIsOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
	const { isOpen: updateModalIsOpen, onOpen: onUpdateModalOpen, onClose: onUpdateModalClose } = useDisclosure()

	const onDeleteCabinet = useCallback(() => {
		if (!cabinet.id) throw new Error('Invalid cabinet')
		deleteCabinet({ roomId: roomId, cabinetId: cabinet.id })
	}, [cabinet.id, deleteCabinet, roomId])

	const onModifyCabinet = useCallback(
		(newName: string) => {
			modifyCabinet({ roomId: roomId, cabinet: { ...cabinet, name: newName } })
		},
		[cabinet, modifyCabinet, roomId]
	)

	const onCardClick = useCallback(() => {
		navigate(`/storage/${roomId}/${cabinet.id}`)
	}, [cabinet.id, navigate, roomId])

	return (
		<>
			<Card {...style}>
				<CardHeader pb="0px">
					<Flex width="full" justifyContent="space-between">
						<Flex direction="column" onClick={onCardClick} _hover={{ cursor: 'pointer' }}>
							<Flex alignItems="center" gap="2">
								<Icon as={Lockers} boxSize={6} />
								<Heading size="md">{cabinet.name}</Heading>
							</Flex>
							<Text>{cabinet.description ?? 'No description'}</Text>
						</Flex>
						{hasPermission(Permissions.MANAGE_STORAGE) && (
							<Menu isLazy={true}>
								<MenuButton
									as={IconButton}
									aria-label="Options"
									icon={<Icon as={DotsThreeVertical} weight="bold" boxSize={6} />}
									variant="ghost"
								/>
								<MenuList>
									<MenuItem
										icon={<Icon as={PencilSimple} weight="bold" boxSize={5} />}
										onClick={onUpdateModalOpen}
									>
										Edit cabinet
									</MenuItem>
									<MenuItem
										icon={<Icon as={Trash} weight="bold" boxSize={5} />}
										onClick={onDeleteModalOpen}
									>
										Delete cabinet
									</MenuItem>
								</MenuList>
							</Menu>
						)}
						{!hasPermission(Permissions.MANAGE_STORAGE) && (
							<Spacer onClick={onCardClick} _hover={{ cursor: 'pointer' }} />
						)}
					</Flex>
				</CardHeader>
				<CardBody pb="0px" onClick={onCardClick} _hover={{ cursor: 'pointer' }}>
					<Text>{`${cabinet.shelves?.length ?? 0} shel${cabinet.shelves?.length === 1 ? 'f' : 'ves'}`}</Text>
				</CardBody>
			</Card>
			<ConfirmModal
				onClose={onDeleteModalClose}
				isOpen={deleteModalIsOpen}
				isLoading={deleteIsLoading}
				error={deleteError}
				flavour="delete"
				onConfirm={onDeleteCabinet}
			/>
			<ChangeStorageNameModal
				onClose={onUpdateModalClose}
				isOpen={updateModalIsOpen}
				isLoading={modifyIsLoading}
				title="Change the cabinet name"
				defaultValue={cabinet.name}
				onConfirm={onModifyCabinet}
				error={modifyError}
				isSuccess={modifySuccess}
			/>
		</>
	)
}
