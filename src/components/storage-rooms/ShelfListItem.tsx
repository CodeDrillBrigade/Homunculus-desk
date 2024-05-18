import { Shelf } from '../../models/embed/storage/Shelf'
import { Card, CardHeader, Flex, Heading, Icon } from '@chakra-ui/react'
import { BsInboxes } from 'react-icons/bs'

export const ShelfListItem = ({ shelf, onClick }: { shelf: Shelf; onClick?: () => void }) => {
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
