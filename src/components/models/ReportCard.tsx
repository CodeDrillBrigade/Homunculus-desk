import {
	Box,
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
import React, { ChangeEvent, useCallback, useEffect } from 'react'
import { PencilSimple, Power, Trash } from '@phosphor-icons/react'
import { useGetUsersByIdsQuery } from '../../services/user'
import { ConfirmModal } from '../modals/ConfirmModal'
import { Report } from '../../models/Report'
import { useDeleteReportMutation, useModifyReportMutation, useSetReportStatusMutation } from '../../services/report'
import { ReportStatus } from '../../models/embed/ReportStatus'
import { AddReportForm } from '../forms/AddReportForm'
import { RecipientsList } from './RecipientsList'
import { capitalize } from '../../utils/string-utils'

interface ReportCardProps {
	report: Report
}

export const ReportCard = ({ report }: ReportCardProps) => {
	const { onOpen: deleteModalOpen, onClose: deleteModalClose, isOpen: deleteModalIsOpen } = useDisclosure()
	const { onOpen: modifyModalOpen, onClose: modifyModalClose, isOpen: modifyModalIsOpen } = useDisclosure()

	const [setReportStatus, { isLoading: changeStatusLoading }] = useSetReportStatusMutation()
	const { data: users } = useGetUsersByIdsQuery(report.recipients)
	const [deleteReport, { error: deleteError, isLoading: deleteLoading, isSuccess: deleteSuccess }] =
		useDeleteReportMutation()
	const [modifyReport, { error: modifyError, isLoading: modifyLoading, isSuccess: modifySuccess, reset }] =
		useModifyReportMutation()

	const onToggleStatus = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			if (event.target.checked) {
				setReportStatus({ reportId: report._id, status: ReportStatus.ACTIVE })
			} else {
				setReportStatus({ reportId: report._id, status: ReportStatus.INACTIVE })
			}
		},
		[report._id, setReportStatus]
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
						color={report.status === ReportStatus.INACTIVE ? 'gray' : 'white'}
					/>
					<Switch
						isChecked={report.status !== ReportStatus.INACTIVE}
						isDisabled={changeStatusLoading}
						onChange={onToggleStatus}
						ml="0.5em"
					/>
				</Flex>
				<Heading size="md">{report.name}</Heading>
			</CardHeader>
			<CardBody pt="0px">
				{!!report.description && <Text fontSize="lg">{report.description}</Text>}
				<RecipientsList recipients={report.recipients} />
				<Box mt="0.5em">
					<Text fontSize="lg" as="b">
						Sent at
					</Text>
					<Text>{report.repeatAt.map(it => `${capitalize(it.day)} ${it.hour}:00`).join(', ')}</Text>
				</Box>
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
					deleteReport(report._id)
				}}
			/>
			<Modal isOpen={modifyModalIsOpen} onClose={modifyModalClose} size="full">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader pb="0px">
						<Center>
							<Heading size={'lg'}>Update Report: {report.name}</Heading>
						</Center>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody paddingBottom="1em">
						<AddReportForm
							submitAction={updates => {
								modifyReport({
									...report,
									...updates,
								})
							}}
							submitError={modifyError}
							submitIsLoading={modifyLoading}
							submitSuccess={modifySuccess}
							reset={reset}
							buttonLabel="Update Report"
							state={{
								name: report.name,
								description: report.description,
								filters: { includeFilter: report.materialFilter, excludeFilter: report.excludeFilter },
								threshold: report.threshold,
								repeatAt: report.repeatAt,
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
