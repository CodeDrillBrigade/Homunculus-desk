import { BoxDefinition } from '../../models/embed/BoxDefinition'
import { Container, Flex, LayoutProps, SpaceProps, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { describeStep, unitToStepsList } from '../../models/embed/UnitStep'
import { useIsMobileLayout } from '../../hooks/responsive-size'

interface QuantityCounterProps extends SpaceProps, LayoutProps {
	quantity: number
	boxDefinition: BoxDefinition
}

export const QuantityCounter = ({ quantity, boxDefinition, ...style }: QuantityCounterProps) => {
	const isMobile = useIsMobileLayout()
	const iconBg = useColorModeValue('blue.200', 'blue.600')
	const unitAsSteps = unitToStepsList(boxDefinition.boxUnit)
	const quantityInBaseUnit = [...unitAsSteps]
		.reverse()
		.reduce(
			(previous, current) => {
				const stepInBaseUnit = current.qty * previous[0]
				return [stepInBaseUnit, ...previous]
			},
			[1]
		)
		.slice(1, unitAsSteps.length + 1)
	const iconsCount = quantityInBaseUnit.reduce(
		(previous, current) => {
			const stepCount = Math.floor(previous.total / current)
			const remainder = previous.total % current
			return {
				total: remainder,
				count: [...previous.count, stepCount],
			}
		},
		{ total: quantity, count: [] } as { total: number; count: number[] }
	).count
	return (
		<Stack direction={isMobile ? 'column' : 'row'} justifyContent="left" {...style}>
			{unitAsSteps.map((it, idx) => (
				<Flex justifyContent="left" key={idx}>
					<Container
						borderRadius="full"
						backgroundColor={iconBg}
						width="1.7em"
						height="1.7em"
						paddingTop="0.25em"
						paddingLeft="0.35em"
						marginRight="0.5em"
						marginLeft="0px"
					>
						{it.icon}
					</Container>
					<Text marginRight="0.5em">
						{iconsCount[idx]} {describeStep(unitAsSteps, idx)}
					</Text>
				</Flex>
			))}
		</Stack>
	)
}
