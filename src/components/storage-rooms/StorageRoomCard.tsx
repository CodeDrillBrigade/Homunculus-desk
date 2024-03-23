import {StorageRoom} from "../../models/StorageRoom";
import {Card, CardHeader, Heading, LayoutProps, SpaceProps} from "@chakra-ui/react";

interface StorageRoomCardProps extends SpaceProps, LayoutProps {
	storageRoom: StorageRoom
}

export const StorageRoomCard = ({ storageRoom, ...style }: StorageRoomCardProps) => {
	return (
		<Card {...style}>
			<CardHeader>
				<Heading>{storageRoom.name}</Heading>
			</CardHeader>
		</Card>
	)
}