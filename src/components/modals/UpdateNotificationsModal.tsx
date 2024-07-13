import { NotificationStub } from '../../models/dto/NotificationStub'
import {
	Button,
	Checkbox,
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
} from '@chakra-ui/react'
import React, { useCallback, useEffect } from 'react'
import { useAddMaterialToAlertsExclusionsMutation } from '../../services/alert'
import { useAddMaterialToReportsExclusionsMutation } from '../../services/report'
import { ErrorAlert } from '../errors/ErrorAlert'

interface UpdateNotificationsModalProps {
	materialId: string
	alerts?: NotificationStub[]
	reports?: NotificationStub[]
	isOpen: boolean
	onClose: () => void
}

export const UpdateNotificationsModal = ({
	materialId,
	alerts,
	reports,
	isOpen,
	onClose,
}: UpdateNotificationsModalProps) => {
	const [alertsToUpdate, setAlertsToUpdate] = React.useState<string[]>([])
	const [reportsToUpdate, setReportsToUpdate] = React.useState<string[]>([])

	const [updateAlerts, { isLoading: alertsLoading, error: alertError, isSuccess: alertSuccess }] =
		useAddMaterialToAlertsExclusionsMutation()
	const [updateReports, { isLoading: reportsLoading, error: reportError, isSuccess: reportSuccess }] =
		useAddMaterialToReportsExclusionsMutation()

	const onSubmit = useCallback(() => {
		updateAlerts({ materialId, alertIds: alertsToUpdate })
		updateReports({ materialId, reportIds: reportsToUpdate })
	}, [alertsToUpdate, materialId, reportsToUpdate, updateAlerts, updateReports])

	useEffect(() => {
		if (alertSuccess && reportSuccess) {
			onClose()
		}
	}, [alertSuccess, onClose, reportSuccess])

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="xl">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					<Text>Include the Material in the existing Alerts and Reports?</Text>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					{!!alertError && (
						<ErrorAlert info={{ label: 'An error occurred while updating alerts', reason: alertError }} />
					)}
					{!!reportError && (
						<ErrorAlert info={{ label: 'An error occurred while updating reports', reason: reportError }} />
					)}
					{!!alerts && (
						<Flex direction="column" justifyContent="left" width="100%" mt="1em">
							<Text fontSize="xl">Alerts</Text>
							{alerts.map(alert => (
								<Checkbox
									key={alert.id}
									defaultChecked={true}
									onChange={e => {
										if (e.target.checked) {
											setAlertsToUpdate(a => a.filter(it => it !== alert.id))
										} else {
											setAlertsToUpdate(a => a.filter(it => it !== alert.id).concat([alert.id]))
										}
									}}
								>
									{alert.name}
								</Checkbox>
							))}
						</Flex>
					)}
					{!!reports && (
						<Flex direction="column" justifyContent="left" width="100%" mt="1em">
							<Text fontSize="xl">Reports</Text>
							{reports.map(report => (
								<Checkbox
									key={report.id}
									defaultChecked={true}
									onChange={e => {
										if (e.target.checked) {
											setReportsToUpdate(a => a.filter(it => it !== report.id))
										} else {
											setReportsToUpdate(a =>
												a.filter(it => it !== report.id).concat([report.id])
											)
										}
									}}
								>
									{report.name}
								</Checkbox>
							))}
						</Flex>
					)}
				</ModalBody>
				<ModalFooter>
					<Button colorScheme="blue" mr={3} onClick={onSubmit} isLoading={alertsLoading || reportsLoading}>
						Create
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}
