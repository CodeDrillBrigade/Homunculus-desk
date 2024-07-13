import { useAddShelfMutation } from '../../services/storageRoom'
import { useState } from 'react'
import { FormValue } from '../../models/form/FormValue'
import { Button, Card, CardBody, CardHeader, Center, Grid, GridItem, Heading, Icon, Tooltip } from '@chakra-ui/react'
import { TextInput } from './controls/TextInput'
import { QueryStatus } from '@reduxjs/toolkit/query'
import { extractErrorMessage } from '../../utils/error-utils'
import { CheckCircle, Warning } from '@phosphor-icons/react'

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
							valueConsumer={setNewShelfName}
						/>
					</GridItem>
					<GridItem colSpan={1}>
						<Center paddingTop="0.3em">
							{status === QueryStatus.fulfilled && !error && (
								<Icon as={CheckCircle} weight="fill" boxSize={8} color="green.400" />
							)}
							{!!error && (
								<Tooltip label={extractErrorMessage(error)} fontSize="md">
									<Icon as={Warning} weight="fill" boxSize={8} color="red.400" />
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
