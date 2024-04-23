import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Button,
	Card,
	CardBody,
	CardHeader,
	Center,
	Heading,
	SpaceProps,
	VStack,
} from '@chakra-ui/react'
import { MaterialSelector } from '../forms/controls/MaterialSelector'
import { ShelfSelector } from '../forms/controls/ShelfSelector'
import { FormValue } from '../../models/form/FormValue'
import { Material } from '../../models/Material'
import { FormValues, useForm } from '../../hooks/form'
import { useGetBoxDefinitionQuery } from '../../services/boxDefinition'
import { BoxUnitSelector } from '../forms/controls/BoxUnitSelector'
import { TextInput } from '../forms/controls/TextInput'
import { DatePicker } from '../forms/controls/DatePicker'
import { useCreateBoxMutation } from '../../services/box'
import { useCallback, useEffect } from 'react'
import { BoxUnit } from '../../models/embed/BoxUnit'
import { useFormControl } from '../../hooks/form-control'
import { ErrorAlert } from '../errors/ErrorAlert'

interface AddBoxFormProps extends SpaceProps {
	something?: string
}

interface BoxFormValue extends FormValues {
	material: FormValue<Material>
	shelf: FormValue<string>
	description: FormValue<string>
	quantity: FormValue<BoxUnit>
}

const initialState: BoxFormValue = {
	material: { value: undefined, isValid: false },
	shelf: { value: undefined, isValid: false },
	quantity: { value: undefined, isValid: false },
	description: { value: undefined, isValid: true },
}

export const AddBoxForm = ({ something, ...style }: AddBoxFormProps) => {
	const [createBox, { error, isLoading, isSuccess }] = useCreateBoxMutation()
	const { formState, dispatchState, isInvalid } = useForm({ initialState })

	const descriptionControls = useFormControl<string>({ valueConsumer: value => dispatchState('description', value) })
	const shelfControls = useFormControl<string>({
		validator: input => !!input,
		valueConsumer: value => dispatchState('shelf', value),
	})
	const materialControls = useFormControl<Material>({
		validator: input => !!input,
		valueConsumer: value => dispatchState('material', value),
	})
	const currentBoxDefinitionId = formState.material.value?.boxDefinition
	const { data: boxDefinition } = useGetBoxDefinitionQuery(currentBoxDefinitionId ?? '', {
		skip: !currentBoxDefinitionId || currentBoxDefinitionId.length <= 0,
	})

	const onSubmit = useCallback(() => {
		if (!isInvalid) {
			if (!formState.material.isValid || !formState.material.value) {
				console.error('Material is not valid!')
				return
			}
			if (!formState.shelf.isValid || !formState.shelf.value) {
				console.error('Shelf is not valid!')
				return
			}
			if (!formState.quantity.isValid || !formState.quantity.value) {
				console.error('Quantity is not valid!')
				return
			}
			createBox({
				description: formState.description.value,
				material: formState.material.value._id!,
				position: formState.shelf.value,
				quantity: formState.quantity.value,
				usageLogs: [],
			})
		}
	}, [
		createBox,
		formState.description.value,
		formState.material.isValid,
		formState.material.value,
		formState.quantity.isValid,
		formState.quantity.value,
		formState.shelf.isValid,
		formState.shelf.value,
		isInvalid,
	])

	useEffect(() => {
		if (isSuccess) {
			descriptionControls.resetValue()
			shelfControls.resetValue()
			materialControls.resetValue()
			dispatchState('reset')
		}
	}, [descriptionControls, dispatchState, isSuccess, materialControls, shelfControls])

	return (
		<Card margin="2em" {...style}>
			<CardHeader>
				<Center>
					<Heading>Add a new Box</Heading>
				</Center>
			</CardHeader>
			<CardBody>
				<VStack>
					<TextInput
						label="Description"
						placeholder="Description (optional)"
						controls={descriptionControls}
					/>
					<DatePicker label="Expiration date" marginTop="1.5em" />
					<ShelfSelector
						label="Shelf"
						controls={shelfControls}
						invalidLabel="You must select a shelf"
						marginTop="1.5em"
					/>
					<MaterialSelector
						label="Material"
						placeholder="Choose a material"
						controls={materialControls}
						invalidLabel="You must select a valid material"
						marginTop="1.5em"
					/>
					{formState.material.isValid && !!boxDefinition?.boxUnit && (
						<BoxUnitSelector
							boxUnit={boxDefinition.boxUnit}
							label="Quantity of items in the box"
							validator={input => !!input && !input.boxUnit && input.quantity > 0}
							invalidLabel="The box cannot be empty"
							borderWidth="1px"
							borderRadius="md"
							padding="0.6em"
							marginTop="1.5em"
							valueConsumer={value => dispatchState('quantity', value)}
						/>
					)}
					<Button colorScheme="blue" mr={3} onClick={onSubmit} isDisabled={isInvalid} isLoading={isLoading}>
						Create
					</Button>
					{!!error && <ErrorAlert info={{ label: 'Cannot create box', reason: error }} />}
					{isSuccess && (
						<Alert status="success">
							<AlertIcon />
							<AlertTitle>Operation completed successfully</AlertTitle>
						</Alert>
					)}
				</VStack>
			</CardBody>
		</Card>
	)
}
