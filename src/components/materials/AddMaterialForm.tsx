import {
	Alert,
	AlertIcon,
	Button,
	Card,
	CardBody,
	CardHeader,
	Heading,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { TextInput } from '../forms/controls/TextInput'
import { TagInput } from '../forms/controls/TagInput'
import { BoxDefinitionBuilder } from '../forms/controls/BoxDefinitionBuilder'
import { useCreateBoxDefinitionMutation } from '../../services/boxDefinition'
import { useCreateMaterialMutation } from '../../services/material'
import { FormValue } from '../../models/form/FormValue'
import { Tag } from '../../models/embed/Tag'
import { BoxDefinition } from '../../models/embed/BoxDefinition'
import { useCallback, useEffect, useState } from 'react'
import { ErrorAlert } from '../errors/ErrorAlert'
import { useFormControl } from '../../hooks/form-control'
import { FormValues, useForm } from '../../hooks/form'
import { MaterialNameSelector } from '../forms/controls/MaterialNameSelector'

interface AddMaterialFormData extends FormValues {
	name: FormValue<string>
	brand: FormValue<string>
	referenceCode: FormValue<string>
	description: FormValue<string>
	tags: FormValue<Tag[]>
	boxDefinition: FormValue<BoxDefinition>
}

const initialState: AddMaterialFormData = {
	name: { value: undefined, isValid: false },
	brand: { value: undefined, isValid: false },
	referenceCode: { value: undefined, isValid: true },
	description: { value: undefined, isValid: true },
	tags: { value: undefined, isValid: true },
	boxDefinition: { value: undefined, isValid: false },
}

export const AddMaterialForm = () => {
	const [isFormReset, setIsFormReset] = useState(false)
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [
		createBoxDefinition,
		{ data: createdBoxId, error: boxError, isSuccess: boxSuccess, isLoading: boxLoading, reset: resetBoxMutation },
	] = useCreateBoxDefinitionMutation()
	const [createMaterial, { error: materialError, isLoading: materialLoading, isSuccess: materialSuccess }] =
		useCreateMaterialMutation()
	const { formState, dispatchState, isInvalid: isFormInvalid } = useForm({ initialState })
	const nameControls = useFormControl<string>({
		validator: (value: string | undefined) => !!value && value.trim().length <= 50,
		valueConsumer: (value: FormValue<string>) => {
			dispatchState('name', value)
		},
	})
	const brandControls = useFormControl<string>({
		validator: (value: string | undefined) => !!value && value.trim().length <= 50,
		valueConsumer: (value: FormValue<string>) => {
			dispatchState('brand', value)
		},
	})
	const referenceCodeControls = useFormControl<string>({
		validator: (value: string | undefined) => !value || value.trim().length <= 100,
		valueConsumer: (value: FormValue<string>) => {
			dispatchState('referenceCode', value)
		},
	})
	const descriptionControls = useFormControl<string>({
		valueConsumer: (value: FormValue<string>) => {
			dispatchState('description', value)
		},
	})
	const tagControls = useFormControl<Tag[]>({
		defaultValue: [],
		valueConsumer: (value: FormValue<Tag[]>) => {
			dispatchState('tags', value)
		},
	})

	useEffect(() => {
		if (!!createdBoxId && boxSuccess && !isFormInvalid) {
			if (!formState.name.isValid || !formState.name.value) {
				console.error('Name is not valid!')
				return
			}
			if (!formState.brand.isValid || !formState.brand.value) {
				console.error('Brand is not valid!')
				return
			}
			if (!boxSuccess || !createdBoxId) {
				console.error('Box is not valid!')
				return
			}
			setIsFormReset(false)
			createMaterial({
				name: formState.name.value,
				brand: formState.brand.value,
				description: formState.description.value,
				referenceCode: formState.referenceCode.value,
				tags: formState.tags?.value?.map(it => it._id!) ?? [],
				boxDefinition: createdBoxId,
			})
		}
	}, [boxSuccess, createMaterial, createdBoxId, formState, isFormInvalid])

	useEffect(() => {
		if (materialSuccess && !isFormReset) {
			setIsFormReset(true)
			onOpen()
			resetBoxMutation()
			nameControls.resetValue()
			brandControls.resetValue()
			descriptionControls.resetValue()
			referenceCodeControls.resetValue()
			tagControls.resetValue()
			dispatchState('reset', undefined)
		}
	}, [
		brandControls,
		descriptionControls,
		dispatchState,
		isFormReset,
		materialSuccess,
		nameControls,
		onOpen,
		referenceCodeControls,
		resetBoxMutation,
		tagControls,
	])

	const consumeBoxDefinition = useCallback(
		(payload: FormValue<BoxDefinition>) => {
			dispatchState('boxDefinition', payload)
		},
		[dispatchState]
	)

	return (
		<>
			<Card>
				<CardHeader>
					<Heading>Add a new Material</Heading>
				</CardHeader>
				<CardBody>
					<VStack>
						{!!boxError && <ErrorAlert info={{ label: 'Something went wrong', reason: boxError }} />}
						{!!materialError && (
							<ErrorAlert info={{ label: 'Something went wrong', reason: materialError }} />
						)}
						<MaterialNameSelector
							label="Name"
							placeholder="Material name"
							controls={nameControls}
							invalidLabel="Material name cannot be null"
						/>
						<TextInput
							label="Brand"
							placeholder="Material brand"
							controls={brandControls}
							invalidLabel="Material brand cannot be null"
						/>
						<TextInput
							label="Reference Code"
							placeholder="The reference code"
							controls={referenceCodeControls}
							invalidLabel="Reference code cannot be null"
						/>
						<TextInput
							label="Description"
							placeholder="Material description (optional)"
							controls={descriptionControls}
						/>
						<TagInput label={'Tags'} controls={tagControls} />
						<BoxDefinitionBuilder valueConsumer={consumeBoxDefinition} />
						<Button
							colorScheme="blue"
							mr={3}
							onClick={() => {
								if (formState.boxDefinition.isValid && !!formState.boxDefinition.value) {
									createBoxDefinition(formState.boxDefinition.value)
								}
							}}
							isDisabled={isFormInvalid}
							isLoading={boxLoading || materialLoading}
						>
							Create
						</Button>
					</VStack>
				</CardBody>
			</Card>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalBody>
						<Alert status="success">
							<AlertIcon />
							Operation completed successfully.
						</Alert>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" onClick={onClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}
