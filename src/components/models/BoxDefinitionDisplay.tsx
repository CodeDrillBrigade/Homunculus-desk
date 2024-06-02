import { BoxDefinition } from '../../models/embed/BoxDefinition'
import { Container, Flex, LayoutProps, SpaceProps, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { describeStep, unitToStepsList } from '../../models/embed/UnitStep'
import { useIsMobileLayout } from '../../hooks/responsive-size'

interface BoxDefinitionDisplayProps extends SpaceProps, LayoutProps {
	boxDefinition: BoxDefinition
}

export const BoxDefinitionDisplay = ({ boxDefinition, ...style }: BoxDefinitionDisplayProps) => {
	const isMobile = useIsMobileLayout()
	const iconBg = useColorModeValue('blue.200', 'blue.600')
	const unitAsSteps = unitToStepsList(boxDefinition.boxUnit)
	return (
		<Stack direction={isMobile ? 'column' : 'row'} justifyContent="left" {...style}>
			{unitAsSteps.slice(0, unitAsSteps.length - 1).map((it, idx) => (
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
						{it.qty} {describeStep(it, unitAsSteps[idx + 1])}
					</Text>
				</Flex>
			))}
		</Stack>
	)
}
