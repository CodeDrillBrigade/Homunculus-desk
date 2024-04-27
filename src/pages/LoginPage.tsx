import { Button, Center, Heading, Input, VStack } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useLoginMutation } from '../services/auth'
import { setAuthenticationState } from '../store/auth/auth-slice'
import { useAppDispatch } from '../hooks/redux'
import { useNavigate } from 'react-router-dom'
import { getToken, localStorageJwtKey, localStorageRefreshJwtKey } from '../store/auth/auth-thunk'
import { QueryStatus } from '@reduxjs/toolkit/query'
import { DarkMode } from '../components/ui/DarkMode'
import { ErrorAlert } from '../components/errors/ErrorAlert'

export const LoginPage = () => {
	const [username, setUsername] = useState<string | null>(null)
	const [password, setPassword] = useState<string | null>(null)
	const [jwt, setJwt] = useState<string | null>(null)
	const [login, { status, error, data }] = useLoginMutation()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	useEffect(() => {
		dispatch(getToken())
			.unwrap()
			.then(token => {
				setJwt(token)
			})
	}, [dispatch])

	useEffect(() => {
		if (!!jwt) {
			navigate('/')
		}
	}, [jwt, navigate])

	const onChangeUsername = (event: React.FormEvent<HTMLInputElement>) => {
		setUsername(event.currentTarget.value)
	}
	const onChangePassword = (event: React.FormEvent<HTMLInputElement>) => {
		setPassword(event.currentTarget.value)
	}

	const onSubmit = useCallback(() => {
		if (!!username && !!password) {
			const data = { username, password }
			login(data)
		}
	}, [login, password, username])

	const onEnterPressed = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Enter') {
				onSubmit()
			}
		},
		[onSubmit]
	)

	useEffect(() => {
		if (!!data) {
			dispatch(setAuthenticationState(data))
			localStorage.setItem(localStorageJwtKey, data.jwt)
			localStorage.setItem(localStorageRefreshJwtKey, data.refreshJwt)
			navigate('/')
		}
	}, [data, dispatch, navigate])

	return (
		<>
			<Center>
				<DarkMode />
			</Center>
			<VStack padding={'0 25vw'}>
				<Heading size="lg">Login</Heading>
				<Input placeholder="Username" onChange={onChangeUsername} onKeyDown={onEnterPressed} />
				<Input type="password" placeholder="Password" onChange={onChangePassword} onKeyDown={onEnterPressed} />
				<Button onClick={onSubmit} isLoading={status === QueryStatus.pending} loadingText="Login">
					Login
				</Button>
				{!!error && <ErrorAlert info={{ label: 'Invalid username or password', reason: error }} />}
			</VStack>
		</>
	)
}
