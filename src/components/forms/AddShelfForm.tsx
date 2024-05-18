import { useAddShelfMutation } from '../../services/storageRoom'
import { useState } from 'react'
import { FormValue } from '../../models/form/FormValue'
import { Button, Card, CardBody, CardHeader, Center, Grid, GridItem, Heading, Tooltip } from '@chakra-ui/react'
import { TextInput } from './controls/TextInput'
import { QueryStatus } from '@reduxjs/toolkit/query'
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons'
import { extractErrorMessage } from '../../utils/error-utils'

export const AddShelfForm = ({ cabinetId, storageRoomId }: { cabinetId: string; storageRoomId: string }) => {
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
