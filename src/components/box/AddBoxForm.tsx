import { Card, CardBody, CardHeader, Center, Heading, SpaceProps, VStack } from '@chakra-ui/react'
import { MaterialSelector } from '../forms/controls/MaterialSelector'

interface AddBoxFormProps extends SpaceProps {
	something?: string
}

export const AddBoxForm = ({ something, ...style }: AddBoxFormProps) => {
	return (
		<Card margin="2em" {...style}>
			<CardHeader>
				<Center>
					<Heading>Add a new Box</Heading>
				</Center>
			</CardHeader>
			<CardBody>
				<VStack>
					<MaterialSelector
						label="Material"
						placeholder="Choose a material"
						validator={input => !!input}
						invalidLabel="You must select a valid material"
					/>
				</VStack>
			</CardBody>
		</Card>
	)
}
