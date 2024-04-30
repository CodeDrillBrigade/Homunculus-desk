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
} from '@chakra-ui/react'
import { Box as BoxModel } from '../../models/Box'
import { materialApi, useGetMaterialQuery } from '../../services/material'
import { ErrorAlert } from '../errors/ErrorAlert'
import { FaRegCalendarTimes } from 'react-icons/fa'
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

interface ElementBoxProps extends SpaceProps, LayoutProps {
	box: BoxModel
}

export const ElementBox = ({ box, ...style }: ElementBoxProps) => {
	const [deleteBox, { error: deleteError, status: deleteStatus }] = useDeleteBoxMutation()
	const { onOpen, onClose, isOpen } = useDisclosure()
	const { data, error, isLoading } = useGetMaterialQuery(box.material)
	const {
		data: boxDefinition,
		error: boxDefinitionError,
		isLoading: definitionLoading,
	} = useGetBoxDefinitionQuery(data?.boxDefinition ?? '', { skip: !data?.boxDefinition })

	useEffect(() => {
		if (deleteStatus === QueryStatus.fulfilled) {
			onClose()
		}
	}, [deleteStatus, onClose])

	const daysToExpiration = !!box.expirationDate ? daysToToday(box.expirationDate) : undefined
	return (
		<>
			<Card {...style} boxShadow={0} borderWidth="2px">
				<CardHeader>
					<Flex justifyContent="space-between">
						<Box>
							{!!data && <Heading>{data.name}</Heading>}
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
					{!!box.description && <Text fontSize="lg">{box.description}</Text>}
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
				</CardBody>
				<CardFooter>
					<Flex justifyContent="space-between">
						<Button colorScheme="red" leftIcon={<DeleteIcon />} onClick={onOpen}>
							Delete
						</Button>
					</Flex>
				</CardFooter>
			</Card>
			<ConfirmModal
				onClose={onClose}
				isOpen={isOpen}
				isLoading={deleteStatus === QueryStatus.pending}
				flavour="delete"
				error={deleteError}
				onConfirm={() => {
					deleteBox(box)
				}}
			/>
		</>
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
