import { Cabinet } from '../../models/embed/storage/Cabinet'
import { Card, CardHeader, Flex, Heading, Icon, LayoutProps, SpaceProps, Text } from '@chakra-ui/react'
import { BiCabinet } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'

interface CabinetCardProps extends SpaceProps, LayoutProps {
	cabinet: Cabinet
	roomId: string
}

export const CabinetCard = ({ cabinet, roomId, ...style }: CabinetCardProps) => {
	const navigate = useNavigate()

	const onCardClick = useCallback(() => {
		navigate(`/storage/${roomId}/${cabinet.id}`)
	}, [cabinet.id, navigate, roomId])

	return (
		<>
			<Card {...style} onClick={onCardClick} _hover={{ cursor: 'pointer' }}>
				<CardHeader>
					<Flex alignItems="center" gap="2">
						<Icon as={BiCabinet} boxSize={6} />
						<Heading size="md">{cabinet.name}</Heading>
					</Flex>
					{!!cabinet.description && <Text>{cabinet.description}</Text>}
				</CardHeader>
			</Card>
		</>
	)
}
