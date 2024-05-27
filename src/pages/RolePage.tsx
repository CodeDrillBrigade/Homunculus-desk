import {useAddRoleMutation, useGetAllRolesQuery} from "../services/role"
import {
	Button,
	Heading,
	HStack,
	ListItem,
	OrderedList,
	Text,
	VStack
} from "@chakra-ui/react"
import {TextInput} from "../components/forms/controls/TextInput";
import {PERMISSIONS} from "../models/security/Permission";
import {PermissionsCheckBox} from "../components/forms/controls/PermissionsCheckBox";
import {useFormControl} from "../hooks/form-control";
import {FormValue} from "../models/form/FormValue";
import {FormValues, useForm} from "../hooks/form";
import {useCallback} from "react";

interface InsertRoleValues extends FormValues {
	name:FormValue<string>,
	description:FormValue<string>,
	permissions:FormValue<PERMISSIONS[]>,
}

const initialState: InsertRoleValues = {
	name: {value:undefined, isValid:false},
	description: {value:undefined, isValid:true},
	permissions: {value:undefined, isValid:false}
}

export const RolePage = () => {
	const { isLoading, error, data: roles } = useGetAllRolesQuery()
	const [createRole, {error:createError, status:createStatus}] = useAddRoleMutation()
	const { formState, dispatchState, isInvalid } = useForm({initialState})

	const checkBoxControls = useFormControl<PERMISSIONS[]>({
		validator: (control: PERMISSIONS[]|undefined) => !!control && control.length > 0,
		valueConsumer: (value) => { dispatchState("permissions", value)}
	})

	const roleNameControls = useFormControl<string>({
		validator: (control: string | undefined) => { return !!control && control.length > 0},
		valueConsumer: (value) => { dispatchState("name", value)}
	})

	const roleDescriptionControls = useFormControl<string>({
		validator: () => true,
		valueConsumer: (value) => { dispatchState("description", value)}
	})

	const validateAndCreate = useCallback(() => {
		if (!isInvalid) {
			if (!formState.name.isValid || !formState.name.value) {
				console.error("Role name is not valid.")
				return
			}
			if (!formState.description.isValid || !formState.description.value) {
				console.error("Role description is not valid.")
				return
			}
			if (!formState.permissions.isValid || !formState.permissions.value) {
				console.error("Role permissions are not valid.")
				return
			}

			const permissions = formState.permissions.value.map((p) => {
				return Object.keys(PERMISSIONS).find(key => PERMISSIONS[key as keyof typeof PERMISSIONS] === p);
			}).filter(key => key !== undefined) as PERMISSIONS[];

			createRole({
				name: formState.name.value,
				description: formState.description.value,
				permissions: permissions,
			})
		}
	},
	[
		createRole,
		formState.name.value,
		formState.name.isValid,
		formState.description.value,
		formState.description.isValid,
		formState.permissions.value,
		formState.permissions.isValid,
		isInvalid
	])

	return <>
			<HStack marginTop={50} width={"100vw"}>
				<VStack id={"RolesList"} width={"50vw"}>
					<VStack>
						<Heading>ALL ROLES</Heading>
						<OrderedList>
							{ roles ? roles.map((e,index) =>
									<ListItem key={index}>
										<Text fontSize={"large"}>{e.name}</Text>
										<Text fontSize={"medium"}>{e.description}</Text>
								</ListItem>
							) : "aargh"}
						</OrderedList>
					</VStack>
				</VStack>

				<VStack id={"NewRoleForm"} width={"50vw"} paddingRight={20}>
					<Heading>Create a new Role</Heading>
						<VStack w={"100%"} id={"RightSideOfForm"}>
							<TextInput
								label={"Name"}
								placeholder={"Name of the role"}
								controls={roleNameControls}
							/>

							<TextInput
								label={"Description"}
								placeholder={"Short description of what the role allows the user to do"}
								controls={roleDescriptionControls}
							/>

							<PermissionsCheckBox
								width={"100%"}
								marginTop={10}
								label={`Permissions to be granted to the ${formState.name.value ? `"${formState.name.value}" role` : "new role"}`}
								values={
								Object.values(PERMISSIONS).map((e)=> {
									return {name: e, value: e}
								})
							}
								controls={checkBoxControls}
							/>
							<Button
								marginTop={50}
								colorScheme={"orange"}
								isDisabled={isInvalid}
								onClick={validateAndCreate}
							>Add role</Button>
						</VStack>
					</VStack>

			</HStack>
	</>
}

export default RolePage
