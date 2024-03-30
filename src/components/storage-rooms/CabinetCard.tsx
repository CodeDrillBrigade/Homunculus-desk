import {Cabinet} from "../../models/embed/storage/Cabinet";
import {Card, CardHeader, Flex, Heading, Icon, LayoutProps, SpaceProps, Text, useDisclosure} from "@chakra-ui/react";
import { BiCabinet } from "react-icons/bi";
import {ShelvesModal} from "./ShelvesModal";

interface CabinetCardProps extends SpaceProps, LayoutProps {
	cabinet: Cabinet;
	roomId: string;
}

export const CabinetCard = ({ cabinet, roomId, ...style }: CabinetCardProps) => {
	const { isOpen, onClose, onOpen } = useDisclosure()
	return (<>
		<ShelvesModal isOpen={isOpen} onClose={onClose} cabinet={cabinet} roomId={roomId}/>
		<Card {...style} onClick={onOpen} _hover={{ cursor: "pointer" }}>
		<CardHeader>
			<Flex alignItems="center" gap="2">
				<Icon as={BiCabinet} boxSize={6}/>
				<Heading size="md">{cabinet.name}</Heading>
			</Flex>
			{!!cabinet.description && <Text>{cabinet.description}</Text>}
		</CardHeader>
	</Card>
	</>)
}