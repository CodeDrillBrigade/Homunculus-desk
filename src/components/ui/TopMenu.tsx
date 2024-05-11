import {
	Avatar,
	AvatarBadge,
	Box,
	Button,
	Flex,
	HStack,
	Icon,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	SkeletonCircle,
	Spacer,
	Text,
	Tooltip,
	useDisclosure,
} from '@chakra-ui/react'
import { DarkMode } from './DarkMode'
import { resetToken } from '../../store/auth/auth-thunk'
import { useAppDispatch } from '../../hooks/redux'
import { useChangePasswordMutation, useGetCurrentUserQuery } from '../../services/user'
import { BsExclamationLg } from 'react-icons/bs'
import { TbLogout } from 'react-icons/tb'
import { ErrorAlert } from '../errors/ErrorAlert'
import { FormValues, useForm } from '../../hooks/form'
import { FormValue } from '../../models/form/FormValue'
import { useCallback, useEffect } from 'react'
import { User } from '../../models/User'
import { ChangePasswordForm } from '../forms/ChangePasswordForm'

export const TopMenu = () => {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const { data: user, error, isLoading } = useGetCurrentUserQuery()
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (!!user && !user.passwordHash) {
			onOpen()
		}
	}, [onOpen, user])

	return (
		<>
			<Flex as={'nav'} p={'10px'} alignItems={'center'}>
				<HStack>
					{!!user && (
						<>
							<Menu>
								<MenuButton>
									<Avatar name={user.name ?? user.username}>
										{!user.passwordHash && (
											<AvatarBadge boxSize="1.25em" bg="red.400">
												<Icon as={BsExclamationLg} boxSize="0.6em" />
											</AvatarBadge>
										)}
									</Avatar>
								</MenuButton>
								<MenuList>
									<MenuItem onClick={onOpen}>
										{!user.passwordHash && (
											<Box bg="red.400" borderRadius="full" width="1.9em" mr="1em">
												<Icon as={BsExclamationLg} boxSize={5} ml="0.35em" mt="0.3em" />
											</Box>
										)}{' '}
										Change Password
									</MenuItem>
								</MenuList>
							</Menu>
							<Text>{user.name ?? user.username}</Text>
						</>
					)}
					{isLoading && <SkeletonCircle size="12" />}
					{!!error && (
						<Tooltip label={`Cannot load the user: ${JSON.stringify(error)}`} aria-label="Error tooltip">
							<Avatar bg="red.400" icon={<Icon as={BsExclamationLg} boxSize={9} />} />
						</Tooltip>
					)}
				</HStack>
				<Spacer />
				<DarkMode />
				<Spacer />
				<Button
					colorScheme={'orange'}
					onClick={() => {
						dispatch(resetToken())
					}}
					rightIcon={<Icon as={TbLogout} boxSize={7} />}
				>
					Logout
				</Button>
			</Flex>
			{!!user && <ChangePasswordModal isOpen={isOpen} onClose={onClose} user={user} />}
		</>
	)
}

interface ChangePasswordModalProps {
	user: User
	isOpen: boolean
	onClose: () => void
}

interface ChangePasswordFormState extends FormValues {
	password: FormValue<string>
	repeat: FormValue<string>
}

const initialState: ChangePasswordFormState = {
	password: { value: undefined, isValid: false },
	repeat: { value: undefined, isValid: false },
}

const ChangePasswordModal = ({ isOpen, onClose, user }: ChangePasswordModalProps) => {
	const [changePassword, { error, isLoading, isSuccess }] = useChangePasswordMutation()
	const { formState, dispatchState, isInvalid } = useForm({ initialState })

	const onSubmit = useCallback(
		(formState: ChangePasswordFormState) => {
			if (!!formState.password.value && !!formState.repeat.value) {
				changePassword({ userId: user._id, password: { password: formState.password.value } })
			} else {
				throw Error('There was an error changing the password')
			}
		},
		[changePassword, user._id]
	)

	useEffect(() => {
		if (isSuccess) {
			onClose()
		}
	}, [isSuccess, onClose])

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Change your password</ModalHeader>
				<ModalCloseButton />

				<ModalBody>
					{!!error && (
						<ErrorAlert info={{ label: 'An error occurred while changing password', reason: error }} />
					)}
					<ChangePasswordForm
						user={user}
						passwordConsumer={payload => {
							dispatchState('password', payload)
						}}
						repeatPasswordConsumer={payload => {
							dispatchState('repeat', payload)
						}}
						repeatValidator={input => !!input && formState.password.value === input}
					/>
				</ModalBody>

				<ModalFooter>
					<Button
						colorScheme="blue"
						mr={3}
						onClick={() => {
							onSubmit(formState)
						}}
						isDisabled={isInvalid}
						isLoading={isLoading}
					>
						Change password
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}
