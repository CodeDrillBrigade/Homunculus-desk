import { User } from '../../models/User'
import { FormValues, useForm } from '../../hooks/form'
import { FormValue } from '../../models/form/FormValue'
import { useChangePasswordMutation } from '../../services/user'
import { useCallback, useEffect } from 'react'
import {
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
import { ChangePasswordForm } from '../forms/ChangePasswordForm'

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

export const ChangePasswordModal = ({ isOpen, onClose, user }: ChangePasswordModalProps) => {
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
						canBeNull={false}
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
