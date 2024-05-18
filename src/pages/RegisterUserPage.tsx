import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLoginMutation } from '../services/auth'
import React, { useCallback, useEffect, useState } from 'react'
import { useLazyGetUserByEmailQuery } from '../services/user'
import { useAppDispatch } from '../hooks/redux'
import { setAuthenticationState } from '../store/auth/auth-slice'
import { localStorageJwtKey, localStorageRefreshJwtKey } from '../store/auth/auth-thunk'
import { Alert, AlertIcon, Center, Heading, Skeleton } from '@chakra-ui/react'
import { ErrorAlert } from '../components/errors/ErrorAlert'
import { generateSkeletons } from '../components/ui/StackedSkeleton'
import { UserStatus } from '../models/embed/UserStatus'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { RegisterUserForm } from '../components/forms/RegisterUserForm'

export const RegisterUserPage = () => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const email = searchParams.get('email')
	const tmpToken = searchParams.get('secret')

	const [login, { error: loginError, data: jwtResponse, isLoading: loginLoading }] = useLoginMutation()
	const [getUserByEmail, { data: user, error: userError, isLoading: userLoading }] = useLazyGetUserByEmailQuery()
	const [updateUserSuccess, setUpdateUserSuccess] = useState<boolean>(false)
	const [updateUserError, setUpdateUserError] = useState<FetchBaseQueryError | SerializedError | undefined>(undefined)

	const onUpdateSuccess = useCallback(() => {
		setUpdateUserSuccess(true)
	}, [])

	const onUpdateError = useCallback((error: FetchBaseQueryError | SerializedError) => {
		setUpdateUserError(error)
	}, [])

	useEffect(() => {
		if (!!tmpToken && !!email) {
			login({ username: email, password: tmpToken })
		}
	}, [email, login, tmpToken])

	useEffect(() => {
		if (!!jwtResponse) {
			dispatch(setAuthenticationState(jwtResponse))
			localStorage.setItem(localStorageJwtKey, jwtResponse.jwt)
			localStorage.setItem(localStorageRefreshJwtKey, jwtResponse.refreshJwt)
			getUserByEmail(email!)
		}
	}, [dispatch, email, getUserByEmail, jwtResponse])

	useEffect(() => {
		if (!tmpToken || !email) {
			navigate('/')
		}
	}, [email, navigate, tmpToken])

	useEffect(() => {
		if (!!updateUserError || !!userError || !!loginError || (!!user && user.status !== UserStatus.REGISTERING)) {
			setTimeout(() => navigate('/'), 3000)
		}
	}, [loginError, navigate, updateUserError, user, userError])

	return (
		<>
			<Center>
				<Heading>Register</Heading>
			</Center>
			{!!updateUserError && (
				<ErrorAlert
					info={{
						label: 'There was an error while creating the user, you will be redirected shortly.',
						reason: updateUserError,
					}}
				/>
			)}
			{!!loginError && (
				<ErrorAlert
					info={{
						label: 'There was an error while getting the registration data, you will be redirected shortly.',
						reason: loginError,
					}}
				/>
			)}
			{!!userError && (
				<ErrorAlert
					info={{
						label: 'There was an error while getting the registration data, you will be redirected shortly.',
						reason: userError,
					}}
				/>
			)}
			{!!user && user.status !== UserStatus.REGISTERING && !updateUserSuccess && (
				<ErrorAlert
					info={{
						label: 'There is no registration pending for this user, you will be redirected shortly.',
						reason: userError,
					}}
				/>
			)}
			{updateUserSuccess && (
				<Alert status="success">
					<AlertIcon />
					Operation successful, you will be redirected shortly.
				</Alert>
			)}
			{(loginLoading || userLoading) && (
				<Skeleton>{generateSkeletons({ quantity: 1, minWidth: '90vw', height: '10vh' })}</Skeleton>
			)}
			{!!jwtResponse && !!user && (
				<RegisterUserForm
					user={user}
					onUpdateSuccess={onUpdateSuccess}
					onUpdateError={onUpdateError}
					pl="10vw"
					pr="10vw"
				/>
			)}
		</>
	)
}
