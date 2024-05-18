import React, { useCallback, useState } from 'react'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import { ErrorAlert } from '../errors/ErrorAlert'
import { RegisterUserForm } from '../forms/RegisterUserForm'
import { User } from '../../models/User'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'

interface ContinueRegistrationModalProps {
	isOpen: boolean
	onClose: () => void
	user: User
}

export const ContinueRegistrationModal = ({ isOpen, onClose, user }: ContinueRegistrationModalProps) => {
	const [updateUserError, setUpdateUserError] = useState<FetchBaseQueryError | SerializedError | undefined>(undefined)

	const onUpdateSuccess = useCallback(() => {
		onClose()
	}, [onClose])

	const onUpdateError = useCallback((error: FetchBaseQueryError | SerializedError) => {
		setUpdateUserError(error)
	}, [])

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Complete your registration</ModalHeader>
				<ModalCloseButton />

				<ModalBody>
					{!!updateUserError && (
						<ErrorAlert
							info={{
								label: 'There was an error while creating the user.',
								reason: updateUserError,
							}}
						/>
					)}
					<RegisterUserForm user={user} onUpdateSuccess={onUpdateSuccess} onUpdateError={onUpdateError} />
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}
