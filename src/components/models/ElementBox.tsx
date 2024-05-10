import {
	Card,
	CardBody,
	CardHeader,
	Container,
	Flex,
	Heading,
	Icon,
	LayoutProps,
	Skeleton,
	SpaceProps,
	Box,
	Text,
	CardFooter,
	Button,
	useDisclosure,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionIcon,
	AccordionPanel,
	VStack,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
} from '@chakra-ui/react'
import { Box as BoxModel } from '../../models/Box'
import { useGetMaterialQuery } from '../../services/material'
import { ErrorAlert } from '../errors/ErrorAlert'
import { FaRegCalendarTimes } from 'react-icons/fa'
import { FiUpload } from 'react-icons/fi'
import { FaBoxOpen } from 'react-icons/fa'
import { daysToToday, toDayMonthYear } from '../../utils/date-utils'
import { IconType } from 'react-icons'
import { useGetBoxDefinitionQuery } from '../../services/boxDefinition'
import { QuantityCounter } from './QuantityCounter'
import { DeleteIcon } from '@chakra-ui/icons'
import { ConfirmModal } from '../modals/ConfirmModal'
import { useDeleteBoxMutation } from '../../services/box'
import { QueryStatus } from '@reduxjs/toolkit/query'
import { useEffect } from 'react'
import { UsageLogDisplay } from './UsageLogDisplay'
import { Material } from '../../models/Material'
import { BoxUnit } from '../../models/embed/BoxUnit'
import { UpdateQuantityForm } from '../forms/UpdateQuantityForm'

interface ElementBoxProps extends SpaceProps, LayoutProps {
	box: BoxModel
}

export const ElementBox = ({ box, ...style }: ElementBoxProps) => {
	const [deleteBox, { error: deleteError, status: deleteStatus }] = useDeleteBoxMutation()
	const { onOpen: deleteModalOpen, onClose: deleteModalClose, isOpen: deleteModalIsOpen } = useDisclosure()
	const { onOpen: updateModalOpen, onClose: updateModalClose, isOpen: updateModalIsOpen } = useDisclosure()
	const { data, error, isLoading } = useGetMaterialQuery(box.material)
	const {
		data: boxDefinition,
		error: boxDefinitionError,
		isLoading: definitionLoading,
	} = useGetBoxDefinitionQuery(data?.boxDefinition ?? '', { skip: !data?.boxDefinition })

	useEffect(() => {
		if (deleteStatus === QueryStatus.fulfilled) {
			deleteModalClose()
		}
	}, [deleteStatus, deleteModalClose])

	const daysToExpiration = !!box.expirationDate ? daysToToday(box.expirationDate) : undefined
	return (
		<>
			<Card {...style} boxShadow={0} borderWidth="2px">
				<CardHeader>
					<Flex justifyContent="space-between">
						<Box>
							{!!data && (
								<>
									<Heading>{data.name}</Heading>
									{!!box.description && <Text fontSize="lg">{box.description}</Text>}
								</>
							)}
							{isLoading && (
								<Container>
									<Skeleton height="2em" width="10em" />
								</Container>
							)}
							{!!error && <ErrorAlert info={{ label: 'Cannot load material', reason: error }} />}
						</Box>
						<Flex>
							{box.quantity.quantity <= 0 && <WarningIcon icon={FaBoxOpen} color="red" />}
							{!!daysToExpiration && daysToExpiration > 0 && daysToExpiration <= 10 && (
								<WarningIcon
									icon={FaRegCalendarTimes}
									text={toDayMonthYear(box.expirationDate)}
									color="yellow.500"
								/>
							)}
							{!!daysToExpiration && daysToExpiration <= 0 && (
								<WarningIcon
									icon={FaRegCalendarTimes}
									text={toDayMonthYear(box.expirationDate)}
									color="red"
								/>
							)}
						</Flex>
					</Flex>
				</CardHeader>
				<CardBody paddingTop="0px">
					<Text>Batch number: {box.batchNumber}</Text>
					{definitionLoading && (
						<Container>
							<Skeleton height="2em" width="10em" />
						</Container>
					)}
					{!!boxDefinitionError && (
						<ErrorAlert info={{ label: 'Cannot load box definition', reason: boxDefinitionError }} />
					)}
					{!!boxDefinition && (
						<QuantityCounter
							quantity={box.quantity.quantity}
							boxDefinition={boxDefinition}
							marginTop="0.7em"
						/>
					)}
					<Accordion marginTop="1em" allowToggle>
						<AccordionItem>
							<h2>
								<AccordionButton>
									<AccordionIcon marginRight="1em" />
									<Box as="span" flex="1" textAlign="left">
										Usage Logs
									</Box>
								</AccordionButton>
							</h2>
							<AccordionPanel pb={4}>
								<VStack justifyContent="left">
									{box.usageLogs.map(log => (
										<UsageLogDisplay key={log.date} log={log} boxDefinition={boxDefinition} />
									))}
								</VStack>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
				</CardBody>
				<CardFooter>
					<Flex width="full" justifyContent="space-between">
						<Button
							colorScheme="blue"
							leftIcon={<Icon as={FiUpload} />}
							onClick={updateModalOpen}
							isDisabled={!data || !boxDefinition?.boxUnit}
						>
							Use/Add
						</Button>
						<Button colorScheme="red" leftIcon={<DeleteIcon />} onClick={deleteModalOpen}>
							Delete
						</Button>
					</Flex>
				</CardFooter>
			</Card>
			<ConfirmModal
				onClose={deleteModalClose}
				isOpen={deleteModalIsOpen}
				isLoading={deleteStatus === QueryStatus.pending}
				flavour="delete"
				error={deleteError}
				onConfirm={() => {
					deleteBox(box)
				}}
			/>
			{!!boxDefinition?.boxUnit && !!data && (
				<UpdateBoxFormModal
					isOpen={updateModalIsOpen}
					onClose={updateModalClose}
					box={box}
					material={data}
					boxDefinition={boxDefinition.boxUnit}
				/>
			)}
		</>
	)
}

interface UpdateBoxFormModalProps {
	isOpen: boolean
	onClose: () => void
	box: BoxModel
	material: Material
	boxDefinition: BoxUnit
}

const UpdateBoxFormModal = ({ isOpen, onClose, box, material, boxDefinition }: UpdateBoxFormModalProps) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					Update {material.name}, batch {box.batchNumber}
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody paddingBottom="1em">
					<UpdateQuantityForm box={box} boxDefinition={boxDefinition} onDispatched={onClose} />
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}

const WarningIcon = ({ icon, text, color }: { icon: IconType; text?: string; color: string }) => {
	return (
		<Box textAlign="center" marginLeft="0.5em">
			<Icon as={icon} boxSize={!!text ? 6 : 8} color={color} />
			{!!text && (
				<Text color={color} marginTop="0px" fontSize="sm">
					{text}
				</Text>
			)}
		</Box>
	)
}
