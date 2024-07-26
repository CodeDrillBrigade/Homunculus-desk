import {
	Alert,
	AlertIcon,
	Button,
	Image,
	Heading,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	useDisclosure,
	VStack,
	useColorMode,
} from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useLoginMutation } from '../services/auth'
import { setAuthenticationState } from '../store/auth/auth-slice'
import { useAppDispatch } from '../hooks/redux'
import { useNavigate } from 'react-router-dom'
import { getToken, localStorageJwtKey, localStorageRefreshJwtKey } from '../store/auth/auth-thunk'
import { QueryStatus } from '@reduxjs/toolkit/query'
import { DarkMode } from '../components/ui/DarkMode'
import { ErrorAlert } from '../components/errors/ErrorAlert'
import { useResetPasswordRequestMutation } from '../services/process'
import { useFormControl } from '../hooks/form-control'
import { FormValue } from '../models/form/FormValue'
import { TextInput } from '../components/forms/controls/TextInput'
import { useIsMobileLayout } from '../hooks/responsive-size'

export const LoginPage = () => {
	const { colorMode } = useColorMode()
	const isMobile = useIsMobileLayout()
	const { isOpen, onOpen, onClose } = useDisclosure()
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
			<VStack padding={isMobile ? '0 5vw' : '0 25vw'}>
				<Image
					src={
						process.env.PUBLIC_URL +
						`${colorMode === 'dark' ? '/homunculus_dark.svg' : '/homunculus_light.svg'}`
					}
					boxSize={{ base: '60vw', lg: '20vw' }}
					alt="Homunculus Logo"
				/>
				<Heading size="lg">Login</Heading>
				<Input placeholder="Username" onChange={onChangeUsername} onKeyDown={onEnterPressed} />
				<Input type="password" placeholder="Password" onChange={onChangePassword} onKeyDown={onEnterPressed} />
				<Stack width={isMobile ? '100%' : '50%'} justifyContent="space-between" marginTop="1em">
					<Button
						colorScheme="blue"
						onClick={onSubmit}
						isLoading={status === QueryStatus.pending}
						loadingText="Login"
					>
						Login
					</Button>
					<Button colorScheme="red" onClick={onOpen}>
						Reset password
					</Button>
					<DarkMode />
				</Stack>
				{!!error && <ErrorAlert info={{ label: 'Invalid username or password', reason: error }} />}
			</VStack>
			<StartResetPasswordModal isOpen={isOpen} onClose={onClose} />
		</>
	)
}

const StartResetPasswordModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const [startPasswordReset, { error, isLoading, isSuccess }] = useResetPasswordRequestMutation()
	const [email, setEmail] = useState<FormValue<string>>({ value: undefined, isValid: false })
	const controls = useFormControl<string>({
		validator: input => {
			const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			return !!input && regex.test(input)
		},
		valueConsumer: payload => setEmail(payload),
	})

	const onSubmit = () => {
		if (!!email.value && email.isValid) {
			startPasswordReset(email.value)
			controls.resetValue()
		}
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Change your password</ModalHeader>
				<ModalCloseButton />

				<ModalBody>
					{!!error && (
						<ErrorAlert info={{ label: 'An error occurred while resetting the password', reason: error }} />
					)}
					{isSuccess && (
						<Alert status="success">
							<AlertIcon />
							Operation successful, you will receive an email containing the instructions to reset your
							password.
						</Alert>
					)}
					<TextInput
						label="Your email"
						placeholder="Your email"
						controls={controls}
						invalidLabel="You must specify a valid email."
					/>
				</ModalBody>

				<ModalFooter>
					<Button
						colorScheme="blue"
						mr={3}
						onClick={onSubmit}
						isDisabled={!email.isValid}
						isLoading={isLoading}
					>
						Change password
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}
