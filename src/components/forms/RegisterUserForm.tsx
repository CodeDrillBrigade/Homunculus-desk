import { FormValues, useForm } from '../../hooks/form'
import { FormValue } from '../../models/form/FormValue'
import { User } from '../../models/User'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { useLazyGetUserByEmailQuery, useLazyGetUserByUsernameQuery, useModifyUserMutation } from '../../services/user'
import React, { useCallback, useEffect } from 'react'
import { UserStatus } from '../../models/embed/UserStatus'
import { Button, LayoutProps, SpaceProps, VStack } from '@chakra-ui/react'
import { ErrorAlert } from '../errors/ErrorAlert'
import { TextInput } from './controls/TextInput'
import { ChangePasswordForm } from './ChangePasswordForm'

interface RegisterUserFromState extends FormValues {
	username: FormValue<string>
	name: FormValue<string>
	email: FormValue<string>
	surname: FormValue<string>
	password: FormValue<string>
	repeat: FormValue<string>
}

interface RegisterUserFormProps extends LayoutProps, SpaceProps {
	user: User
	forceNewUsername: boolean
	forceNewPassword: boolean
	canChangeEmail: boolean
	buttonLabel: string
	onUpdateError: (error: FetchBaseQueryError | SerializedError) => void
	onUpdateSuccess: () => void
}

function isPasswordValid(password: FormValue<string>, repeat: FormValue<string>, forceNotNull: boolean): boolean {
	if (!forceNotNull && (!password.value || password.value.length === 0)) {
		return true
	} else {
		return password.isValid && !!password.value && password.value === repeat.value
	}
}

export const RegisterUserForm = ({
	user,
	onUpdateError,
	onUpdateSuccess,
	buttonLabel,
	forceNewPassword,
	canChangeEmail,
	forceNewUsername,
	...style
}: RegisterUserFormProps) => {
	const [getUserByUsername, { isSuccess: usernameSuccess, isLoading: usernameLoading }] =
		useLazyGetUserByUsernameQuery()
	const [getUserByEmail, { isSuccess: emailSuccess, isLoading: emailLoading }] = useLazyGetUserByEmailQuery()
	const [
		modifyUser,
		{ isLoading: updateUserLoading, error: updateUserError, isSuccess: updateUserSuccess, reset: updateReset },
	] = useModifyUserMutation()
	const { formState, dispatchState, isInvalid } = useForm({
		initialState: {
			username: { value: forceNewUsername ? undefined : user.username, isValid: !forceNewUsername },
			name: { value: user.name, isValid: !!user.name },
			email: { value: user.email, isValid: true },
			surname: { value: user.surname, isValid: !!user.surname },
			password: { value: undefined, isValid: !forceNewPassword },
			repeat: { value: undefined, isValid: !forceNewPassword },
		},
	})

	const usernameIsDuplicate = !usernameLoading && usernameSuccess && formState.username.value !== user.username
	const emailIsDuplicate = canChangeEmail && !emailLoading && emailSuccess && formState.email.value !== user.email

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (formState.username.isValid && !!formState.username.value) {
				getUserByUsername(formState.username.value)
			}
		}, 1000)

		return () => clearTimeout(timeoutId)
	}, [formState.username, formState.username.isValid, formState.username.value, getUserByUsername])

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (formState.email.isValid && !!formState.email.value) {
				getUserByEmail({ email: formState.email.value })
			}
		}, 1000)

		return () => clearTimeout(timeoutId)
	}, [formState.email.isValid, formState.email.value, getUserByEmail])

	useEffect(() => {
		if (!!updateUserError) {
			onUpdateError(updateUserError)
		}
	}, [onUpdateError, updateUserError])

	useEffect(() => {
		if (updateUserSuccess) {
			updateReset()
			onUpdateSuccess()
		}
	}, [onUpdateSuccess, updateReset, updateUserSuccess])

	const onSubmit = useCallback(
		(formState: RegisterUserFromState) => {
			if (!user) {
				throw new Error('User is not valid')
			}
			if (!formState.username.isValid || !formState.username.value || usernameIsDuplicate) {
				throw new Error('Username is not valid')
			}
			if (!formState.name.isValid || !formState.name.value) {
				throw new Error('Name is not valid')
			}
			if (!formState.surname.isValid || !formState.surname.value) {
				throw new Error('Surname is not valid')
			}
			if (!isPasswordValid(formState.password, formState.repeat, forceNewPassword)) {
				throw new Error('Password is not valid')
			}
			if (canChangeEmail && (!formState.email.isValid || !formState.email.value || emailIsDuplicate)) {
				throw new Error('Email is not valid')
			}
			modifyUser({
				_id: user._id,
				username: formState.username.value,
				status: UserStatus.ACTIVE,
				email: canChangeEmail ? formState.email.value : undefined,
				name: formState.name.value,
				surname: formState.surname.value,
				passwordHash:
					!forceNewPassword && (!formState.password.value || formState.password.value.length === 0)
						? undefined
						: formState.password.value,
			})
		},
		[canChangeEmail, emailIsDuplicate, forceNewPassword, modifyUser, user, usernameIsDuplicate]
	)

	return (
		<VStack {...style}>
			{usernameIsDuplicate && (
				<ErrorAlert info={{ label: 'Error', reason: 'The provided username already exists' }} />
			)}
			{emailIsDuplicate && <ErrorAlert info={{ label: 'Error', reason: 'The provided email already exists' }} />}
			<TextInput
				label="Username"
				placeholder="Username"
				defaultValue={forceNewUsername ? undefined : user.username}
				validator={input => !!input && input.length <= 50}
				valueConsumer={payload => dispatchState('username', payload)}
				invalidLabel="The username cannot exceed 50 characters"
			/>
			{canChangeEmail && (
				<TextInput
					label="Email"
					placeholder="Email"
					defaultValue={user.email}
					validator={input => {
						const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
						return !!input && regex.test(input)
					}}
					valueConsumer={payload => dispatchState('email', payload)}
					invalidLabel="Email is not valid"
				/>
			)}
			<TextInput
				label="Name"
				placeholder="Name"
				defaultValue={user.name}
				validator={input => !!input}
				valueConsumer={payload => dispatchState('name', payload)}
				invalidLabel="Invalid name"
			/>
			<TextInput
				label="Surname"
				placeholder="Surname"
				defaultValue={user.surname}
				validator={input => !!input}
				valueConsumer={payload => dispatchState('surname', payload)}
				invalidLabel="Invalid surname"
			/>
			<ChangePasswordForm
				user={user}
				canBeNull={!forceNewPassword}
				passwordConsumer={payload => {
					dispatchState('password', payload)
				}}
				repeatPasswordConsumer={payload => {
					dispatchState('repeat', payload)
				}}
				repeatValidator={input =>
					(!forceNewPassword && (!formState.password.value || formState.password.value === '')) ||
					(!!input && formState.password.value === input)
				}
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
				isDisabled={isInvalid || usernameIsDuplicate || emailIsDuplicate || updateUserSuccess}
				isLoading={updateUserLoading}
			>
				{buttonLabel}
			</Button>
		</VStack>
	)
}
