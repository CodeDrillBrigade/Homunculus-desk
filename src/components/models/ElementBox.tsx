import {
	Card,
	CardBody,
	CardHeader,
	Container,
	Flex,
	Heading,
	Icon,
	LayoutProps,
	Skeleton,
	SpaceProps,
	Box,
	Text,
} from '@chakra-ui/react'
import { Box as BoxModel } from '../../models/Box'
import { useGetMaterialQuery } from '../../services/material'
import { ErrorAlert } from '../errors/ErrorAlert'
import { FaRegCalendarTimes } from 'react-icons/fa'
import { FaBoxOpen } from 'react-icons/fa'
import { daysToToday, toDayMonthYear } from '../../utils/date-utils'
import { IconType } from 'react-icons'

interface ElementBoxProps extends SpaceProps, LayoutProps {
	box: BoxModel
}

export const ElementBox = ({ box, ...style }: ElementBoxProps) => {
	const { data, error, isLoading } = useGetMaterialQuery(box.material)

	const daysToExpiration = !!box.expirationDate ? daysToToday(box.expirationDate) : undefined
	return (
		<Card {...style} boxShadow={0} borderWidth="2px">
			<CardHeader>
				<Flex justifyContent="space-between">
					<Box>
						{!!data && <Heading>{data.name}</Heading>}
						{isLoading && (
							<Container>
								<Skeleton height="2em" width="10em" />
							</Container>
						)}
						{!!error && <ErrorAlert info={{ label: 'Cannot load material', reason: error }} />}
					</Box>
					<Flex>
						{box.quantity.quantity <= 0 && <WarningIcon icon={FaBoxOpen} color="red" />}
						{!!daysToExpiration && daysToExpiration > 0 && daysToExpiration <= 10 && (
							<WarningIcon
								icon={FaRegCalendarTimes}
								text={toDayMonthYear(box.expirationDate)}
								color="yellow"
							/>
						)}
						{!!daysToExpiration && daysToExpiration <= 0 && (
							<WarningIcon
								icon={FaRegCalendarTimes}
								text={toDayMonthYear(box.expirationDate)}
								color="red"
							/>
						)}
					</Flex>
				</Flex>
			</CardHeader>
			<CardBody></CardBody>
		</Card>
	)
}

const WarningIcon = ({ icon, text, color }: { icon: IconType; text?: string; color: string }) => {
	return (
		<Box textAlign="center" marginLeft="0.5em">
			<Icon as={icon} boxSize={!!text ? 6 : 8} color={color} />
			{!!text && (
				<Text color={color} marginTop="0px" fontSize="sm">
					{text}
				</Text>
			)}
		</Box>
	)
}
