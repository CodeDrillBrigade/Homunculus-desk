import {
	Alert, AlertDescription,
	AlertIcon, AlertTitle,
	Card,
	CardBody,
	Center,
	Container,
	Heading,
	SimpleGrid,
	useDisclosure,
	VStack
} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";
import {TextWithDescriptionFormData, TextWithDescriptionModal} from "../components/forms/TextWithDescriptionModal";
import {useCreateStorageRoomMutation, useGetStorageRoomsQuery} from "../services/storageRoom";
import {QueryStatus} from "@reduxjs/toolkit/query";
import {generateSkeletons} from "../components/ui/StackedSkeleton";
import {StorageRoomCard} from "../components/storage-rooms/StorageRoomCard";
import {ErrorAlert} from "../components/errors/ErrorAlert";

export const ManageStoragePage = () => {
	const { data, error, status} = useGetStorageRoomsQuery()
	return (<VStack>
		<Container>
			<Heading>Storage Rooms</Heading>
		</Container>
		{status === QueryStatus.pending && generateSkeletons({quantity: 2, minWidth: "90vw", height: "10vh"})}
		{!!error && <ErrorAlert info={{label: "There was an error retrieving the storage rooms!", reason: error}} />}
		{!!data && data.map(it => <StorageRoomCard key={it.id} storageRoom={it} width="90vw" height="15vh"/>)}
		<AddStorageButton />
  </VStack>)
}

const AddStorageButton = () => {
	const [createStorage, { status, error }] = useCreateStorageRoomMutation()
	const { isOpen, onOpen, onClose } = useDisclosure()

	const onSubmit = (formData: TextWithDescriptionFormData) => {
		const name = formData.name.value
		if(!name) {
			throw Error("StorageRoom name is not valid");
		}
		createStorage({ name, description: formData.description.value})
	}

	return (<>
		<TextWithDescriptionModal
			title="Add a Storage Room"
			isOpen={isOpen}
			onClose={onClose}
			onSubmit={onSubmit}
			isSubmitting={status === QueryStatus.pending}
			error={!!error ? {label: "There was an creating the storage room!", reason: error} : undefined}
			shouldClose={status === QueryStatus.fulfilled && !error}
		/>
		<Card width="90vw" height="10vh" _hover={{cursor: "pointer" }} onClick={() => onOpen()}>
			<CardBody>
				<Center paddingTop="0.2%">
					<AddIcon boxSize={10} />
				</Center>
			</CardBody>
		</Card>
	</>)
}