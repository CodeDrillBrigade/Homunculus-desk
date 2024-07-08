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
	Divider,
	IconButton,
} from '@chakra-ui/react'
import { Box as BoxModel } from '../../models/Box'
import { useGetMaterialQuery } from '../../services/material'
import { ErrorAlert } from '../errors/ErrorAlert'
import { daysToToday, toDayMonthYear } from '../../utils/date-utils'
import { useGetBoxDefinitionQuery } from '../../services/boxDefinition'
import { QuantityCounter } from './QuantityCounter'
import { ConfirmModal } from '../modals/ConfirmModal'
import { useDeleteBoxMutation } from '../../services/box'
import React, { useEffect } from 'react'
import { UsageLogDisplay } from './UsageLogDisplay'
import { useIsMobileLayout } from '../../hooks/responsive-size'
import { UpdateBoxFormModal } from '../modals/UpdateBoxFormModal'
import { EditBoxModal } from '../modals/EditBoxModal'
import { Package, Trash, UploadSimple, Icon as PhosphorIcon, CalendarX, PencilSimple } from '@phosphor-icons/react'

interface ElementBoxProps extends SpaceProps, LayoutProps {
	box: BoxModel
}

export const ElementBox = ({ box, ...style }: ElementBoxProps) => {
	const isMobile = useIsMobileLayout()
	const [deleteBox, { error: deleteError, isLoading: deleteLoading, isSuccess: deleteSuccess }] =
		useDeleteBoxMutation()
	const { onOpen: deleteModalOpen, onClose: deleteModalClose, isOpen: deleteModalIsOpen } = useDisclosure()
	const { onOpen: updateModalOpen, onClose: updateModalClose, isOpen: updateModalIsOpen } = useDisclosure()
	const { onOpen: editModalOpen, onClose: editModalClose, isOpen: editModalIsOpen } = useDisclosure()
	const { data, error, isLoading } = useGetMaterialQuery(box.material)
	const {
		data: boxDefinition,
		error: boxDefinitionError,
		isLoading: definitionLoading,
	} = useGetBoxDefinitionQuery(data?.boxDefinition ?? '', { skip: !data?.boxDefinition })

	useEffect(() => {
		if (deleteSuccess) {
			deleteModalClose()
		}
	}, [deleteSuccess, deleteModalClose])

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
							{box.quantity.quantity <= 0 && <WarningIcon icon={Package} color="red" />}
							{!!daysToExpiration && daysToExpiration > 0 && daysToExpiration <= 10 && (
								<WarningIcon
									icon={CalendarX}
									text={toDayMonthYear(box.expirationDate)}
									color="yellow.500"
								/>
							)}
							{!!daysToExpiration && daysToExpiration <= 0 && (
								<WarningIcon icon={CalendarX} text={toDayMonthYear(box.expirationDate)} color="red" />
							)}
							<IconButton
								onClick={editModalOpen}
								aria-label="material settings"
								icon={<Icon as={PencilSimple} boxSize={6} weight="bold" />}
								variant="ghost"
							/>
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
								<VStack align="stretch">
									{box.usageLogs.map((log, idx) => (
										<Flex key={`${log.date}-${idx}`} align="center" justify="start">
											<UsageLogDisplay log={log} boxDefinition={boxDefinition} />
											{isMobile && <Divider key={`${log.date}-divider`} />}
										</Flex>
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
							leftIcon={<Icon as={UploadSimple} weight="bold" boxSize={6} />}
							onClick={updateModalOpen}
							isDisabled={!data || !boxDefinition?.boxUnit}
						>
							Use/Add
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
			</Card>
			<ConfirmModal
				onClose={deleteModalClose}
				isOpen={deleteModalIsOpen}
				isLoading={deleteLoading}
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
			<EditBoxModal onClose={editModalClose} isOpen={editModalIsOpen} box={box} />
		</>
	)
}

const WarningIcon = ({ icon, text, color }: { icon: PhosphorIcon; text?: string; color: string }) => {
	return (
		<Box textAlign="center" marginLeft="0.5em">
			<Icon as={icon} boxSize={!!text ? 6 : 8} color={color} weight="bold" />
			{!!text && (
				<Text color={color} marginTop="0px" fontSize="sm">
					{text}
				</Text>
			)}
		</Box>
	)
}
