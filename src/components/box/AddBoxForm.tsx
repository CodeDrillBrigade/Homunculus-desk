import { Card, CardBody, CardHeader, Center, Heading, SpaceProps, VStack } from '@chakra-ui/react'
import { MaterialSelector } from '../forms/controls/MaterialSelector'
import { ShelfSelector } from '../forms/controls/ShelfSelector'
import { FormValue } from '../../models/form/FormValue'
import { Material } from '../../models/Material'

interface AddBoxFormProps extends SpaceProps {
	something?: string
}

interface BoxFormValue {
	material: FormValue<Material>
	shelf: FormValue<string>
}

enum BoxFormValueAction {
	SET_MATERIAL,
	SET_SHELF,
}

const initialState: BoxFormValue = {
	material: { value: undefined, isValid: false },
	shelf: { value: undefined, isValid: true },
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
					<ShelfSelector
						label="Shelf"
						validator={input => !!input}
						invalidLabel="You must select a shelf"
						marginTop="1.5em"
					/>
				</VStack>
			</CardBody>
		</Card>
	)
}
