import { UsageLog } from '../../models/embed/UsageLog'
import { Container, Flex, Icon, Skeleton, Text } from '@chakra-ui/react'
import { Operation } from '../../models/embed/Operation'
import { toDayMonthYear } from '../../utils/date-utils'
import { useGetUserByIdQuery } from '../../services/user'
import { ErrorAlert } from '../errors/ErrorAlert'
import { BoxDefinition } from '../../models/embed/BoxDefinition'
import { QuantityCounter } from './QuantityCounter'
import { useIsMobileLayout } from '../../hooks/responsive-size'
import { MinusCircle, PlusCircle } from '@phosphor-icons/react'

interface UsageLogDisplayProps {
	log: UsageLog
	boxDefinition?: BoxDefinition
}

export const UsageLogDisplay = ({ log, boxDefinition }: UsageLogDisplayProps) => {
	const isMobile = useIsMobileLayout()
	const { data, error, isLoading } = useGetUserByIdQuery(log.user)
	return (
		<>
			{isLoading && (
				<Container>
					<Skeleton height="2em" width="10em" />
				</Container>
			)}
			{!!error && <ErrorAlert info={{ label: 'Cannot load user', reason: error }} />}
			{!!data && (
				<Flex justifyContent="left" width="100%" flexDirection={isMobile ? 'column' : 'row'}>
					<Flex mb={isMobile ? '1em' : undefined}>
						{log.operation === Operation.ADD ? (
							<Icon as={PlusCircle} color="green.400" boxSize={6} />
						) : (
							<Icon as={MinusCircle} color="red.400" boxSize={6} />
						)}
						<Text marginLeft="0.5em" marginRight="0.5em">
							{toDayMonthYear(log.date)} - {data.name} {data.surname}
						</Text>
					</Flex>
					{!!boxDefinition ? (
						<QuantityCounter quantity={log.quantity.quantity} boxDefinition={boxDefinition} />
					) : (
						<Text>{log.quantity.quantity}</Text>
					)}
				</Flex>
			)}
		</>
	)
}
