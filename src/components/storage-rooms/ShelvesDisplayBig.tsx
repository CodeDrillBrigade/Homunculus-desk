import {
	Box,
	Button,
	Card,
	CardBody,
	CardHeader,
	Center,
	Flex,
	Grid,
	GridItem,
	Heading,
	Icon,
	Tooltip,
	VStack,
} from '@chakra-ui/react'
import { Cabinet } from '../../models/embed/storage/Cabinet'
import { TextInput } from '../forms/controls/TextInput'
import { useState } from 'react'
import { FormValue } from '../../models/form/FormValue'
import { useAddShelfMutation } from '../../services/storageRoom'
import { QueryStatus } from '@reduxjs/toolkit/query'
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons'
import { extractErrorMessage } from '../../utils/error-utils'
import { Shelf } from '../../models/embed/storage/Shelf'
import { BsInboxes } from 'react-icons/bs'
import { useGetBoxByPositionQuery } from '../../services/box'
import { ElementBox } from '../models/ElementBox'
import { generateSkeletons } from '../ui/StackedSkeleton'
import { ErrorAlert } from '../errors/ErrorAlert'

interface ShelvesModalProps {
	cabinet: Cabinet
	roomId: string
}

export const ShelvesDisplayBig = ({ cabinet, roomId }: ShelvesModalProps) => {
	const [selectedShelf, setSelectedShelf] = useState<string | undefined>(undefined)
	const { data, error, isLoading } = useGetBoxByPositionQuery(selectedShelf ?? '', { skip: !selectedShelf })
	return (
		<Box paddingRight="1.5em" paddingLeft="1.5em">
			<Grid templateColumns="repeat(4, 1fr)" templateRows="repeat(1, 1fr)" gap={4} height="85vh">
				<GridItem colSpan={1} borderWidth="2px" borderRadius="15px">
					<VStack>
						<Heading key="shlf-hdr">Shelves</Heading>
						{(cabinet.shelves ?? []).map(it => (
							<ShelfListItem
								key={it.id}
								shelf={it}
								onClick={() => {
									setSelectedShelf(`${roomId}|${cabinet.id}|${it.id}`)
								}}
							/>
						))}
						<AddShelfForm key="add-shlf-frm" cabinetId={cabinet.id!} storageRoomId={roomId} />
					</VStack>
				</GridItem>
				<GridItem colSpan={3}>
					<VStack width="100%">
						{!!data && data.map(it => <ElementBox key={it._id} box={it} width="100%" />)}
						{isLoading && generateSkeletons({ quantity: 5, height: '3em' })}
						{!!error && <ErrorAlert info={{ label: 'Cannot load boxes in this shelf', reason: error }} />}
					</VStack>
				</GridItem>
			</Grid>
		</Box>
	)
}

const ShelfListItem = ({ shelf, onClick }: { shelf: Shelf; onClick?: () => void }) => {
	return (
		<Card width="90%" boxShadow={0} borderWidth="2px" _hover={{ cursor: 'pointer' }} onClick={onClick}>
			<CardHeader>
				<Flex alignItems="center" gap="2">
					<Icon as={BsInboxes} boxSize={6} />
					<Heading size="md">{shelf.name}</Heading>
				</Flex>
			</CardHeader>
		</Card>
	)
}

const AddShelfForm = ({ cabinetId, storageRoomId }: { cabinetId: string; storageRoomId: string }) => {
	const [addShelf, { status, error }] = useAddShelfMutation()
	const [newShelfName, setNewShelfName] = useState<FormValue<string>>({ value: undefined, isValid: false })

	return (
		<Card width="90%" boxShadow={0} marginBottom="1.5em">
			<CardHeader paddingBottom="0px" marginBottom="0px">
				<Heading size="md" paddingBottom="0px" marginBottom="0px">
					Add a Shelf
				</Heading>
			</CardHeader>
			<CardBody paddingTop="0.5em">
				<Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(2, 1fr)" gap={2}>
					<GridItem colSpan={2}>
						<TextInput
							label="Name"
							placeholder="Name (max. 50 characters)"
							validator={input => !!input && input.trim().length <= 50}
							valueConsumer={value => {
								setNewShelfName(value)
							}}
						/>
					</GridItem>
					<GridItem colSpan={1}>
						<Center paddingTop="0.5em">
							{status === QueryStatus.fulfilled && !error && (
								<CheckCircleIcon boxSize={6} color="green.400" />
							)}
							{!!error && (
								<Tooltip label={extractErrorMessage(error)} fontSize="md">
									<WarningIcon boxSize={6} color="red.400" />
								</Tooltip>
							)}
						</Center>
					</GridItem>
					<GridItem colSpan={1}>
						<Button
							colorScheme="blue"
							mr={5}
							onClick={() => {
								addShelf({ cabinetId, storageRoomId, shelf: { name: newShelfName.value!! } })
							}}
							isDisabled={!newShelfName.isValid}
							isLoading={status === QueryStatus.pending}
							width="100%"
						>
							Create
						</Button>
					</GridItem>
				</Grid>
			</CardBody>
		</Card>
	)
}
