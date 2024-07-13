import { Cabinet } from '../../models/embed/storage/Cabinet'
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Flex,
	Heading,
	Icon,
	LayoutProps,
	SpaceProps,
	Text,
	useDisclosure,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import React, { useCallback } from 'react'
import { useDeleteCabinetMutation, useModifyCabinetMutation } from '../../services/storageRoom'
import { ConfirmModal } from '../modals/ConfirmModal'
import { ChangeStorageNameModal } from '../modals/ChangeStorageNameModal'
import { Lockers, PencilSimple, Trash } from '@phosphor-icons/react'

interface CabinetCardProps extends SpaceProps, LayoutProps {
	cabinet: Cabinet
	roomId: string
}

export const CabinetCard = ({ cabinet, roomId, ...style }: CabinetCardProps) => {
	const navigate = useNavigate()

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
				<CardHeader pb="0px" onClick={onCardClick} _hover={{ cursor: 'pointer' }}>
					<Flex alignItems="center" gap="2">
						<Icon as={Lockers} boxSize={6} />
						<Heading size="md">{cabinet.name}</Heading>
					</Flex>
					<Text>{cabinet.description ?? 'No description'}</Text>
				</CardHeader>
				<CardBody pb="0px" onClick={onCardClick} _hover={{ cursor: 'pointer' }}>
					<Text>{`${cabinet.shelves?.length ?? 0} shel${cabinet.shelves?.length === 1 ? 'f' : 'ves'}`}</Text>
				</CardBody>
				<CardFooter>
					<Flex width="full" justifyContent="space-between">
						<Button
							colorScheme="blue"
							leftIcon={<Icon as={PencilSimple} weight="bold" boxSize={6} />}
							onClick={onUpdateModalOpen}
						>
							Edit
						</Button>
						<Button
							colorScheme="red"
							leftIcon={<Icon as={Trash} weight="bold" boxSize={6} />}
							onClick={onDeleteModalOpen}
						>
							Delete
						</Button>
					</Flex>
				</CardFooter>
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
