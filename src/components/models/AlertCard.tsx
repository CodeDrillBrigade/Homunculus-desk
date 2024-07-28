import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Center,
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
import { ConfirmModal } from '../modals/ConfirmModal'
import { AddAlertForm } from '../forms/AddAlertForm'
import { RecipientsList } from './RecipientsList'

interface AlertCardProps {
	alert: AlertModel
}

export const AlertCard = ({ alert }: AlertCardProps) => {
	const { onOpen: deleteModalOpen, onClose: deleteModalClose, isOpen: deleteModalIsOpen } = useDisclosure()
	const { onOpen: modifyModalOpen, onClose: modifyModalClose, isOpen: modifyModalIsOpen } = useDisclosure()

	const [setAlertStatus, { isLoading: changeStatusLoading }] = useSetAlertStatusMutation()
	const { data: users } = useGetUsersByIdsQuery(alert.recipients)
	const [deleteAlert, { error: deleteError, isLoading: deleteLoading, isSuccess: deleteSuccess }] =
		useDeleteAlertMutation()
	const [modifyAlert, { error: modifyError, isLoading: modifyLoading, isSuccess: modifySuccess, reset }] =
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
				<RecipientsList recipients={alert.recipients} />
			</CardBody>
			<CardFooter>
				<Flex width="full" justifyContent="space-between">
					<Button
						colorScheme="blue"
						leftIcon={<Icon as={PencilSimple} weight="bold" boxSize={6} />}
						onClick={modifyModalOpen}
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
					<ModalHeader pb="0px">
						<Center>
							<Heading size={'lg'}>Update Alert: {alert.name}</Heading>
						</Center>
					</ModalHeader>
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
							reset={reset}
							buttonLabel="Update Alert"
							state={{
								name: alert.name,
								description: alert.description,
								filters: { includeFilter: alert.materialFilter, excludeFilter: alert.excludeFilter },
								threshold: alert.threshold,
								recipients: users ?? [],
							}}
							closeButtonAction={modifyModalClose}
							onConfirmAction={modifyModalClose}
						/>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Card>
	)
}
