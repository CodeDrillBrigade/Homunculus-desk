import { useNavigate, useSearchParams } from 'react-router-dom'
import React, { useCallback, useEffect } from 'react'
import { useResetPasswordConfirmQuery } from '../services/process'
import { useLoginMutation } from '../services/auth'
import { useAppDispatch } from '../hooks/redux'
import { setAuthenticationState } from '../store/auth/auth-slice'
import { localStorageJwtKey, localStorageRefreshJwtKey } from '../store/auth/auth-thunk'
import { Alert, AlertIcon, Button, Center, Heading, Skeleton, VStack } from '@chakra-ui/react'
import { ErrorAlert } from '../components/errors/ErrorAlert'
import { generateSkeletons } from '../components/ui/StackedSkeleton'
import { useChangePasswordMutation, useLazyGetUserByEmailQuery } from '../services/user'
import { ChangePasswordForm } from '../components/forms/ChangePasswordForm'
import { FormValues, useForm } from '../hooks/form'
import { FormValue } from '../models/form/FormValue'
import { DarkMode } from '../components/ui/DarkMode'

interface ChangePasswordFormState extends FormValues {
	password: FormValue<string>
	repeat: FormValue<string>
}

const initialState: ChangePasswordFormState = {
	password: { value: undefined, isValid: false },
	repeat: { value: undefined, isValid: false },
}

export const PasswordResetPage = () => {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const processId = searchParams.get('secret')
	const email = searchParams.get('email')
	const {
		data: newToken,
		error: resetError,
		isLoading: resetLoading,
	} = useResetPasswordConfirmQuery(processId!, { skip: !processId || !email })
	const [login, { error: loginError, data: jwtResponse, isLoading: loginLoading }] = useLoginMutation()
	const [getUserByEmail, { data: user, error: userError, isLoading: userLoading }] = useLazyGetUserByEmailQuery()
	const [changePassword, { error: changePasswordError, isLoading: changeLoading, isSuccess: changeSuccess }] =
		useChangePasswordMutation()
	const { formState, dispatchState, isInvalid } = useForm({ initialState })
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (!!newToken && !!email) {
			login({ username: email, password: newToken })
		}
	}, [email, login, newToken])

	useEffect(() => {
		if (!!jwtResponse) {
			dispatch(setAuthenticationState(jwtResponse))
			localStorage.setItem(localStorageJwtKey, jwtResponse.jwt)
			localStorage.setItem(localStorageRefreshJwtKey, jwtResponse.refreshJwt)
			getUserByEmail(email!)
		}
	}, [dispatch, email, getUserByEmail, jwtResponse])

	useEffect(() => {
		if (!processId || !email) {
			navigate('/')
		}
	}, [email, navigate, processId])

	useEffect(() => {
		if (!!resetError || !!userError || !!loginError || changeSuccess) {
			setTimeout(() => navigate('/'), 3000)
		}
	}, [changeSuccess, loginError, navigate, resetError, userError])

	const onSubmit = useCallback(
		(formState: ChangePasswordFormState) => {
			if (!!formState.password.value && !!formState.repeat.value && !!user) {
				changePassword({ userId: user._id, password: { password: formState.password.value } })
			} else {
				throw Error('There was an error changing the password')
			}
		},
		[changePassword, user]
	)

	return (
		<>
			<Center mb="1em">
				<Heading>Reset your password</Heading>
			</Center>
			{!!resetError && (
				<ErrorAlert
					info={{
						label: 'There was an error while resetting the password, you will be redirected shortly.',
						reason: resetError,
					}}
				/>
			)}
			{!!loginError && (
				<ErrorAlert
					info={{
						label: 'There was an error while resetting the password, you will be redirected shortly.',
						reason: loginError,
					}}
				/>
			)}
			{!!userError && (
				<ErrorAlert
					info={{
						label: 'There was an error while resetting the password, you will be redirected shortly.',
						reason: userError,
					}}
				/>
			)}
			{!!changePasswordError && (
				<ErrorAlert
					info={{ label: 'There was an error while resetting the password', reason: changePasswordError }}
				/>
			)}
			{!!changeSuccess && (
				<Alert status="success">
					<AlertIcon />
					Operation successful, you will be redirected shortly.
				</Alert>
			)}
			{(resetLoading || loginLoading || userLoading) && (
				<Skeleton>{generateSkeletons({ quantity: 1, minWidth: '90vw', height: '10vh' })}</Skeleton>
			)}
			{!!jwtResponse && !!user && (
				<VStack>
					<ChangePasswordForm
						user={user}
						canBeNull={false}
						passwordConsumer={payload => {
							dispatchState('password', payload)
						}}
						repeatPasswordConsumer={payload => {
							dispatchState('repeat', payload)
						}}
						repeatValidator={input => !!input && formState.password.value === input}
					/>
					<Button
						colorScheme="blue"
						mt="1em"
						onClick={() => {
							onSubmit(formState)
						}}
						isDisabled={isInvalid}
						isLoading={changeLoading}
					>
						Reset password
					</Button>
					<DarkMode />
				</VStack>
			)}
		</>
	)
}
