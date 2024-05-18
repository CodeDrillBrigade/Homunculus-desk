import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Card,
	CardBody,
	CardHeader,
	Center,
	Grid,
	GridItem,
	Heading,
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
import { useGetBoxByPositionQuery } from '../../services/box'
import { ElementBox } from '../models/ElementBox'
import { generateSkeletons } from '../ui/StackedSkeleton'
import { ErrorAlert } from '../errors/ErrorAlert'
import { ShelfListItem } from './ShelfListItem'
import { AddShelfForm } from '../forms/AddShelfForm'

export interface ShelvesDisplayProps {
	cabinet: Cabinet
	roomId: string
}

export const ShelvesDisplayBig = ({ cabinet, roomId }: ShelvesDisplayProps) => {
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
						{!!data && data.length > 0 && data.map(it => <ElementBox key={it._id} box={it} width="100%" />)}
						{!!data && data.length === 0 && <NoBoxesWarning />}
						{isLoading && generateSkeletons({ quantity: 5, height: '3em' })}
						{!!error && <ErrorAlert info={{ label: 'Cannot load boxes in this shelf', reason: error }} />}
					</VStack>
				</GridItem>
			</Grid>
		</Box>
	)
}

export const NoBoxesWarning = () => {
	return (
		<Alert status="warning">
			<AlertIcon />
			There are no boxes on this shelf
		</Alert>
	)
}
