import {
	Avatar,
	Box,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Flex,
	Heading,
	Icon,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Switch,
	Text,
	useDisclosure,
} from '@chakra-ui/react'
import { Alert as AlertModel } from '../../models/Alert'
import { AlertStatus } from '../../models/embed/AlertStatus'
import React, { ChangeEvent, useCallback, useEffect } from 'react'
import { useDeleteAlertMutation, useModifyAlertMutation, useSetAlertStatusMutation } from '../../services/alert'
import { PencilSimple, Power, Trash } from '@phosphor-icons/react'
import { useGetUsersByIdsQuery } from '../../services/user'
import { generateSkeletonAvatars } from '../ui/StackedSkeleton'
import { useIsMobileLayout } from '../../hooks/responsive-size'
import { ErrorAlert } from '../errors/ErrorAlert'
import { ConfirmModal } from '../modals/ConfirmModal'
import { AddAlertForm } from '../forms/AddAlertForm'

interface AlertCardProps {
	alert: AlertModel
}

export const AlertCard = ({ alert }: AlertCardProps) => {
	const isMobile = useIsMobileLayout()

	const { onOpen: deleteModalOpen, onClose: deleteModalClose, isOpen: deleteModalIsOpen } = useDisclosure()
	const { onOpen: modifyModalOpen, onClose: modifyModalClose, isOpen: modifyModalIsOpen } = useDisclosure()

	const [setAlertStatus, { isLoading: changeStatusLoading }] = useSetAlertStatusMutation()
	const { data: users, isLoading: usersLoading, error: usersError } = useGetUsersByIdsQuery(alert.recipients)
	const [deleteAlert, { error: deleteError, isLoading: deleteLoading, isSuccess: deleteSuccess }] =
		useDeleteAlertMutation()
	const [modifyAlert, { error: modifyError, isLoading: modifyLoading, isSuccess: modifySuccess }] =
		useModifyAlertMutation()

	const onToggleStatus = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			if (event.target.checked) {
				setAlertStatus({ alertId: alert._id, status: AlertStatus.ACTIVE })
			} else {
				setAlertStatus({ alertId: alert._id, status: AlertStatus.INACTIVE })
			}
		},
		[alert._id, setAlertStatus]
	)

	useEffect(() => {
		if (deleteSuccess) {
			deleteModalClose()
		}
	}, [deleteSuccess, deleteModalClose])

	return (
		<Card>
			<CardHeader pb="1em">
				<Flex mb="0.5em">
					<Icon
						as={Power}
						boxSize={5}
						weight="bold"
						color={alert.status === AlertStatus.INACTIVE ? 'gray' : 'white'}
					/>
					<Switch
						isChecked={alert.status !== AlertStatus.INACTIVE}
						isDisabled={changeStatusLoading}
						onChange={onToggleStatus}
						ml="0.5em"
					/>
				</Flex>
				<Heading size="md">{alert.name}</Heading>
			</CardHeader>
			<CardBody pt="0px">
				{!!alert.description && <Text fontSize="lg">{alert.description}</Text>}
				<Box mt="0.5em">
					<Text fontSize="lg" as="b">
						Recipients
					</Text>
					<Flex mt="0.2em">
						{usersLoading && generateSkeletonAvatars({ quantity: 3, size: '10' })}
						{!!usersError && (
							<ErrorAlert
								info={{ label: 'There was an error fetching the recipients', reason: usersError }}
							/>
						)}
						{!!users &&
							users.map(user => (
								<Flex key={user._id}>
									<Avatar name={user.name ?? user.username} boxSize={10} backgroundColor="teal" />
									{!isMobile && (
										<Text fontSize="lg" ml="0.6em" mt="0.3em">
											{!!user.name || user.surname
												? `${user.name + ' ' ?? ''}${user.surname ?? ''}`
												: user.username}
										</Text>
									)}
								</Flex>
							))}
					</Flex>
				</Box>
			</CardBody>
			<CardFooter>
				<Flex width="full" justifyContent="space-between">
					<Button
						colorScheme="blue"
						leftIcon={<Icon as={PencilSimple} weight="bold" boxSize={6} />}
						onClick={modifyModalOpen}
						// isDisabled={!data || !boxDefinition?.boxUnit}
					>
						Edit
					</Button>
					<Button
						colorScheme="red"
						leftIcon={<Icon as={Trash} weight="bold" boxSize={6} />}
						onClick={deleteModalOpen}
					>
						Delete
					</Button>
				</Flex>
			</CardFooter>
			<ConfirmModal
				onClose={deleteModalClose}
				isOpen={deleteModalIsOpen}
				isLoading={deleteLoading}
				flavour="delete"
				error={deleteError}
				onConfirm={() => {
					deleteAlert(alert._id)
				}}
			/>
			<Modal isOpen={modifyModalIsOpen} onClose={modifyModalClose} size="full">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Update Alert {alert.name}</ModalHeader>
					<ModalCloseButton />
					<ModalBody paddingBottom="1em">
						<AddAlertForm
							submitAction={updates => {
								modifyAlert({
									...alert,
									...updates,
								})
							}}
							submitError={modifyError}
							submitIsLoading={modifyLoading}
							submitSuccess={modifySuccess}
							reset={() => {}}
							buttonLabel="Update Alert"
							state={{
								name: alert.name,
								description: alert.description,
								filters: { includeFilter: alert.materialFilter, excludeFilter: alert.excludeFilter },
								threshold: alert.threshold,
								recipients: users ?? [],
							}}
							closeButtonAction={modifyModalClose}
						/>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Card>
	)
}
