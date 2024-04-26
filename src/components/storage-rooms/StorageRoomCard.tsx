import {StorageRoom} from "../../models/StorageRoom";
import {
	Card,
	CardBody,
	CardHeader, Center, Flex,
	Heading,
	Icon,
	LayoutProps, ResponsiveValue, SimpleGrid,
	SpaceProps,
	Text,
	useColorModeValue,
	useDisclosure
} from "@chakra-ui/react";
import {CabinetCard} from "./CabinetCard";
import {useAddCabinetMutation} from "../../services/storageRoom";
import {TextWithDescriptionFormData, TextWithDescriptionModal} from "../forms/TextWithDescriptionModal";
import {QueryStatus} from "@reduxjs/toolkit/query";
import {AddIcon} from "@chakra-ui/icons";
import { MdOutlineMeetingRoom } from "react-icons/md";
import {borderDark, borderLight} from "../../styles/theme";

interface StorageRoomCardProps extends SpaceProps, LayoutProps {
	storageRoom: StorageRoom
}

export const StorageRoomCard = ({ storageRoom, ...style }: StorageRoomCardProps) => {
	const borderColor = useColorModeValue(borderLight, borderDark)
	const cabinets = storageRoom.cabinets ?? []
	const cardWidth: ResponsiveValue<string> = {lg: "17vw", md: "25vw", sm: "40vw"}

	return (
		<Card {...style} bg="transparent" borderWidth="2px" borderColor={borderColor}>
			<CardHeader paddingBottom="0px">
				<Flex alignItems="center" gap="2">
					<Icon as={MdOutlineMeetingRoom} boxSize={9}/>
					<Heading size="lg"> {storageRoom.name}</Heading>
				</Flex>
				{!!storageRoom.description && <Text>{storageRoom.description}</Text>}
			</CardHeader>
			<CardBody>
				<SimpleGrid columns={{lg: 5, md: 3, sm: 2}} spacing={{lg: 4, md: 3, sm: 3, base: 2}}>
					{cabinets.map(it => <CabinetCard
						key={it.id}
						cabinet={it}
						roomId={storageRoom._id!}
						height="13vh"
						width={cardWidth}/>)}
					<AddCabinetButton storageRoom={storageRoom} width={cardWidth}/>
				</SimpleGrid>
			</CardBody>
		</Card>
	)
}

const AddCabinetButton = ({ storageRoom, width }: { storageRoom: StorageRoom, width: ResponsiveValue<string> }) => {
	const [addCabinet, { status, error }] = useAddCabinetMutation()
	const { isOpen, onOpen, onClose } = useDisclosure()

	const onSubmit = (formData: TextWithDescriptionFormData) => {
		const name = formData.name.value
		if(!name) {
			throw Error("Cabinet name is not valid");
		}
		if(!!storageRoom._id) {
			addCabinet({ storageRoomId: storageRoom._id, cabinet: { name, description: formData.description.value}})
		}
	}

	return (<>
		<TextWithDescriptionModal
			title="Add a Cabinet"
			isOpen={isOpen}
			onClose={onClose}
			onSubmit={onSubmit}
			isSubmitting={status === QueryStatus.pending}
			error={!!error ? {label: "There was an creating the cabinet!", reason: error} : undefined}
			shouldClose={status === QueryStatus.fulfilled && !error}
		/>
		<Card width={width} height="13vh" _hover={{cursor: "pointer" }} onClick={() => onOpen()}>
			<CardBody>
				<Center paddingTop="1em">
					<AddIcon boxSize={10} />
				</Center>
			</CardBody>
		</Card>
	</>)
}