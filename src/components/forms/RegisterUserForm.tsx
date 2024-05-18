import { FormValues, useForm } from '../../hooks/form'
import { FormValue } from '../../models/form/FormValue'
import { User } from '../../models/User'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { useLazyGetUserByUsernameQuery, useModifyUserMutation } from '../../services/user'
import React, { useCallback, useEffect } from 'react'
import { UserStatus } from '../../models/embed/UserStatus'
import { Button, LayoutProps, SpaceProps, VStack } from '@chakra-ui/react'
import { ErrorAlert } from '../errors/ErrorAlert'
import { TextInput } from './controls/TextInput'
import { ChangePasswordForm } from './ChangePasswordForm'

interface RegisterUserFromState extends FormValues {
	username: FormValue<string>
	name: FormValue<string>
	surname: FormValue<string>
	password: FormValue<string>
	repeat: FormValue<string>
}

const initialState: RegisterUserFromState = {
	username: { value: undefined, isValid: false },
	name: { value: undefined, isValid: false },
	surname: { value: undefined, isValid: false },
	password: { value: undefined, isValid: false },
	repeat: { value: undefined, isValid: false },
}

interface RegisterUserFormProps extends LayoutProps, SpaceProps {
	user: User
	onUpdateError: (error: FetchBaseQueryError | SerializedError) => void
	onUpdateSuccess: () => void
}

export const RegisterUserForm = ({ user, onUpdateError, onUpdateSuccess, ...style }: RegisterUserFormProps) => {
	const [getUserByUsername, { isSuccess: usernameSuccess }] = useLazyGetUserByUsernameQuery()
	const [modifyUser, { isLoading: updateUserLoading, error: updateUserError, isSuccess: updateUserSuccess }] =
		useModifyUserMutation()
	const { formState, dispatchState, isInvalid } = useForm({ initialState })

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (formState.username.isValid && !!formState.username.value) {
				getUserByUsername(formState.username.value)
			}
		}, 1000)

		return () => clearTimeout(timeoutId)
	}, [formState.username, formState.username.isValid, formState.username.value, getUserByUsername])

	useEffect(() => {
		if (!!updateUserError) {
			onUpdateError(updateUserError)
		}
	}, [onUpdateError, updateUserError])

	useEffect(() => {
		if (updateUserSuccess) {
			onUpdateSuccess()
		}
	}, [onUpdateSuccess, updateUserSuccess])

	const onSubmit = useCallback(
		(formState: RegisterUserFromState) => {
			if (!user) {
				throw new Error('User is not valid')
			}
			if (!formState.username.isValid || !formState.username.value || usernameSuccess) {
				throw new Error('Username is not valid')
			}
			if (!formState.name.isValid || !formState.name.value) {
				throw new Error('Name is not valid')
			}
			if (!formState.surname.isValid || !formState.surname.value) {
				throw new Error('Surname is not valid')
			}
			if (
				!formState.password.isValid ||
				!formState.password.value ||
				formState.password.value !== formState.repeat.value
			) {
				throw new Error('Password is not valid')
			}
			modifyUser({
				_id: user._id,
				username: formState.username.value,
				status: UserStatus.ACTIVE,
				name: formState.name.value,
				surname: formState.surname.value,
				passwordHash: formState.password.value,
			})
		},
		[modifyUser, user, usernameSuccess]
	)

	return (
		<VStack {...style}>
			{usernameSuccess && (
				<ErrorAlert info={{ label: 'Error', reason: 'The provided username already exists' }} />
			)}
			<TextInput
				label="Username"
				placeholder="Choose your username"
				validator={input => !!input && input.length <= 50}
				valueConsumer={payload => dispatchState('username', payload)}
				invalidLabel="The username cannot exceed 50 characters"
			/>
			<TextInput
				label="Name"
				placeholder="Name"
				validator={input => !!input}
				valueConsumer={payload => dispatchState('name', payload)}
				invalidLabel="Invalid name"
			/>
			<TextInput
				label="Surname"
				placeholder="Surname"
				validator={input => !!input}
				valueConsumer={payload => dispatchState('surname', payload)}
				invalidLabel="Invalid surname"
			/>
			<ChangePasswordForm
				user={user}
				passwordConsumer={payload => {
					dispatchState('password', payload)
				}}
				repeatPasswordConsumer={payload => {
					dispatchState('repeat', payload)
				}}
				repeatValidator={input => !!input && formState.password.value === input}
				showTokenWarning={false}
				padding="0px"
				margin="0px"
				maxW="100%"
			/>
			<Button
				colorScheme="blue"
				mt="1em"
				onClick={() => {
					onSubmit(formState)
				}}
				isDisabled={isInvalid || usernameSuccess || updateUserSuccess}
				isLoading={updateUserLoading}
			>
				Register
			</Button>
		</VStack>
	)
}
