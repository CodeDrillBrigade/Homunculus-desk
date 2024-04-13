import {Button, Card, CardBody, CardHeader, Heading, VStack} from "@chakra-ui/react";
import {TextInput} from "../forms/controls/TextInput";
import {TagInput} from "../forms/controls/TagInput";
import {BoxDefinitionBuilder} from "../forms/controls/BoxDefinitionBuilder";
import {useCreateBoxDefinitionMutation} from "../../services/boxDefinition";
import {useCreateMaterialMutation} from "../../services/material";
import {FormValue} from "../../models/form/FormValue";
import {Tag} from "../../models/embed/Tag";
import {BoxDefinition} from "../../models/embed/BoxDefinition";
import {useCallback, useEffect, useReducer} from "react";
import {ErrorAlert} from "../errors/ErrorAlert";
import {useFormControl} from "../../hooks/form";

interface AddMaterialFormData {
	name: FormValue<string>;
	brand: FormValue<string>;
	description: FormValue<string>;
	tags: FormValue<Tag[]>;
	boxDefinition: FormValue<BoxDefinition>;
}

export enum FormUpdateAction {
	SET_NAME,
	SET_BRAND,
	SET_DESCRIPTION,
	SET_TAGS,
	SET_BOX,
	RESET
}

const initialState: AddMaterialFormData = {
	name: { value: undefined, isValid: false },
	brand: { value: undefined, isValid: false },
	description: { value: undefined, isValid: true },
	tags: { value: undefined, isValid: true },
	boxDefinition: { value: undefined, isValid: false }
}

function formStateReducer(
	state: AddMaterialFormData,
	action: {type: FormUpdateAction, payload: FormValue<string | Tag[] | BoxDefinition>}
): AddMaterialFormData {
	switch (action.type) {
		case FormUpdateAction.SET_NAME:
			return {
				...state,
				name: action.payload as FormValue<string>
			};
		case FormUpdateAction.SET_DESCRIPTION:
			return {
				...state,
				description: action.payload as FormValue<string>
			}
		case FormUpdateAction.SET_BRAND:
			return {
				...state,
				brand: action.payload as FormValue<string>
			}
		case FormUpdateAction.SET_TAGS:
			return {
				...state,
				tags: action.payload as FormValue<Tag[]>
			}
		case FormUpdateAction.SET_BOX:
			return {
				...state,
				boxDefinition: action.payload as FormValue<BoxDefinition>
			}
		case FormUpdateAction.RESET:
			return initialState
	}
}

export const AddMaterialForm = () => {
	const [
		createBoxDefinition,
		{ data: createdBoxId, error: boxError, isSuccess: boxSuccess, isLoading: boxLoading }
	] = useCreateBoxDefinitionMutation()
	const [
		createMaterial,
		{ error: materialError, isLoading: materialLoading, isSuccess: materialSuccess }
	] = useCreateMaterialMutation()
	const [formState, dispatchFormState] = useReducer(formStateReducer, initialState)
	const nameControls = useFormControl<string>({
		validator: (value: string | undefined) => !!value && value.trim().length <= 50,
		valueConsumer: (value: FormValue<string>) => {
			dispatchFormState({type: FormUpdateAction.SET_NAME, payload: value })
		}
	})
	const brandControls = useFormControl<string>({
		validator: (value: string | undefined) => !!value && value.trim().length <= 50,
		valueConsumer: (value: FormValue<string>) => {
			dispatchFormState({type: FormUpdateAction.SET_BRAND, payload: value })
		}
	})
	const descriptionControls = useFormControl<string>({
		valueConsumer: (value: FormValue<string>) => {
			dispatchFormState({type: FormUpdateAction.SET_DESCRIPTION, payload: value })
		}
	})
	const isFormInvalid = Object.values(formState).some(it => !it.isValid)

	useEffect(() => {
		if(!!createdBoxId && boxSuccess && !isFormInvalid) {
			if(!formState.name.isValid || !formState.name.value) {
				console.error("Name is not valid!")
				return
			}
			if(!formState.brand.isValid || !formState.brand.value) {
				console.error("Brand is not valid!")
				return
			}
			if(!boxSuccess || !createdBoxId) {
				console.error("Box is not valid!")
				return
			}
			createMaterial({
				name: formState.name.value,
				brand: formState.brand.value,
				description: formState.description.value,
				tags: formState.tags?.value?.map( it => it._id!) ?? [],
				boxDefinition: createdBoxId
			})
		}
	}, [boxSuccess, createMaterial, createdBoxId, formState, isFormInvalid]);

	useEffect(() => {
		if(materialSuccess) {
			nameControls.setValue(undefined)
			brandControls.setValue(undefined)
			descriptionControls.setValue(undefined)
		}
	}, [brandControls, descriptionControls, materialSuccess, nameControls])

	const consumeBoxDefinition = useCallback((payload: FormValue<BoxDefinition>) => {
			dispatchFormState({type: FormUpdateAction.SET_BOX, payload })
		}, [])

	return (<Card>
		<CardHeader>
			<Heading>Add a new Material</Heading>
		</CardHeader>
		<CardBody>
			<VStack>
				{!!boxError && <ErrorAlert info={{label: "Something went wrong", reason: boxError}} />}
				{!!materialError && <ErrorAlert info={{label: "Something went wrong", reason: materialError}} />}
				<TextInput
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
					label="Description"
					placeholder="Material description (optional)"
					controls={descriptionControls}
				/>
				<TagInput
					label={"Tags"}
					placeholder={"Choose one or more tags (optional)"}
					valueConsumer={ value => {dispatchFormState({type: FormUpdateAction.SET_TAGS, payload: value })}}
				/>
				<BoxDefinitionBuilder
					valueConsumer={consumeBoxDefinition}
				/>
				<Button
					colorScheme='blue'
					mr={3}
					onClick={() => {
						if(formState.boxDefinition.isValid && !!formState.boxDefinition.value) {
							createBoxDefinition(formState.boxDefinition.value)
						}
					}}
					isDisabled={isFormInvalid}
					isLoading={ boxLoading || materialLoading }
				>Create</Button>
			</VStack>
		</CardBody>
	</Card>)
}