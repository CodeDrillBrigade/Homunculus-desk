import { Card, CardBody, CardHeader, Center, Heading, SpaceProps, VStack } from '@chakra-ui/react'
import { MaterialSelector } from '../forms/controls/MaterialSelector'
import { ShelfSelector } from '../forms/controls/ShelfSelector'
import { FormValue } from '../../models/form/FormValue'
import { Material } from '../../models/Material'
import { FormValues, useForm } from '../../hooks/form'
import { useEffect } from 'react'
import { useGetBoxDefinitionQuery } from '../../services/boxDefinition'

interface AddBoxFormProps extends SpaceProps {
	something?: string
}

interface BoxFormValue extends FormValues {
	material: FormValue<Material>
	shelf: FormValue<string>
}

const initialState: BoxFormValue = {
	material: { value: undefined, isValid: false },
	shelf: { value: undefined, isValid: true },
}

export const AddBoxForm = ({ something, ...style }: AddBoxFormProps) => {
	const { formState, dispatchState, isInvalid } = useForm({ initialState })
	const currentBoxDefinitionId = formState.material.value?.boxDefinition
	const { data: boxDefinition } = useGetBoxDefinitionQuery(currentBoxDefinitionId ?? '', {
		skip: !currentBoxDefinitionId || currentBoxDefinitionId.length <= 0,
	})

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
						valueConsumer={value => dispatchState('material', value)}
						invalidLabel="You must select a valid material"
					/>
					<ShelfSelector
						label="Shelf"
						validator={input => !!input}
						valueConsumer={value => dispatchState('shelf', value)}
						invalidLabel="You must select a shelf"
						marginTop="1.5em"
					/>
				</VStack>
			</CardBody>
		</Card>
	)
}
