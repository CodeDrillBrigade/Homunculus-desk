import {
	Alert,
	AlertIcon,
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/react'
import { ErrorAlert } from '../errors/ErrorAlert'
import { FormValues, useForm } from '../../hooks/form'
import { FormValue } from '../../models/form/FormValue'
import { useFormControl } from '../../hooks/form-control'
import { TextInput } from '../forms/controls/TextInput'
import { useCallback, useEffect, useState } from 'react'
import { useInviteUserMutation, useLazyGetUserByEmailQuery } from '../../services/user'
import { RoleSelector } from '../forms/controls/RoleSelector'

interface InviteModalProps {
	isOpen: boolean
	onClose: () => void
}

export interface InviteUserFromState extends FormValues {
	email: FormValue<string>
	role: FormValue<string>
}

const initialState: InviteUserFromState = {
	email: { value: undefined, isValid: false },
	role: { value: undefined, isValid: false },
}

export const InviteModal = ({ isOpen, onClose }: InviteModalProps) => {
	const { formState, dispatchState, isInvalid } = useForm<InviteUserFromState>({ initialState })
	const [getUserByEmail] = useLazyGetUserByEmailQuery()
	const [inviteUser, { error, isLoading, isSuccess }] = useInviteUserMutation()
	const [userExist, setUserExist] = useState<boolean>(false)

	const emailControls = useFormControl<string>({
		validator: input => {
			const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			return !!input && regex.test(input)
		},
		valueConsumer: payload => dispatchState('email', payload),
	})

	useEffect(() => {
		if (!!formState.email.value && formState.email.isValid) {
			getUserByEmail({ email: formState.email.value, excludeRegistering: true })
				.unwrap()
				.then(
					() => {
						setUserExist(true)
					},
					() => {
						setUserExist(false)
					}
				)
		}
	}, [formState.email, getUserByEmail])

	const onSubmit = useCallback(
		(state: InviteUserFromState) => {
			if (!isInvalid) {
				if (!state.role.value || !state.role.isValid) {
					throw new Error('Roles are not valid')
				}
				if (!state.email.isValid || !state.email.value) {
					throw new Error('Email is not valid')
				}
				inviteUser({
					email: state.email.value,
					username: `new-user-${new Date().getTime()}`,
					role: state.role.value,
				})
			}
		},
		[inviteUser, isInvalid]
	)

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Invite a user</ModalHeader>
				<ModalCloseButton />

				<ModalBody>
					{!!error && (
						<ErrorAlert info={{ label: 'An error occurred while inviting the user', reason: error }} />
					)}
					{userExist && (
						<Alert status="warning">
							<AlertIcon />A user with this email already exists.
						</Alert>
					)}
					{isSuccess && (
						<Alert status="success">
							<AlertIcon />
							The user was successfully invited.
						</Alert>
					)}
					<TextInput
						label="User email"
						placeholder="User email"
						controls={emailControls}
						invalidLabel="You must specify a valid email address."
					/>
					<RoleSelector
						label="User role"
						validator={input => !!input}
						valueConsumer={payload => dispatchState('role', payload)}
						invalidLabel="You must specify a valid role"
						mt="1em"
					/>
				</ModalBody>

				<ModalFooter>
					<Button
						colorScheme="blue"
						mr={3}
						onClick={() => {
							onSubmit(formState)
						}}
						isDisabled={isInvalid || userExist}
						isLoading={isLoading}
					>
						Invite user
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}
