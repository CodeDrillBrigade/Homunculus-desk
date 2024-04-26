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
	Tooltip,
} from '@chakra-ui/react'
import { Box as BoxModel } from '../../models/Box'
import { useGetMaterialQuery } from '../../services/material'
import { ErrorAlert } from '../errors/ErrorAlert'
import { IoWarning } from 'react-icons/io5'

interface ElementBoxProps extends SpaceProps, LayoutProps {
	box: BoxModel
}

export const ElementBox = ({ box, ...style }: ElementBoxProps) => {
	const { data, error, isLoading } = useGetMaterialQuery(box.material)
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
					{!!box.expirationDate && box.expirationDate < new Date().getTime() && (
						<Icon as={IoWarning} boxSize={10} color="red" />
					)}
				</Flex>
			</CardHeader>
			<CardBody></CardBody>
		</Card>
	)
}
