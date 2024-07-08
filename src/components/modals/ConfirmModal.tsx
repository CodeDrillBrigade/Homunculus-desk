import {
	Button,
	Icon,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	VStack,
} from '@chakra-ui/react'
import { ErrorAlert } from '../errors/ErrorAlert'
import { Trash } from '@phosphor-icons/react'
import React from 'react'

interface ConfirmModalProps {
	onClose: () => void
	isOpen: boolean
	isLoading: boolean
	flavour: 'delete'
	error?: any | undefined
	onConfirm: () => void
}

export const ConfirmModal = ({ onClose, isOpen, isLoading, flavour, error, onConfirm }: ConfirmModalProps) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{flavour === 'delete' && <Text>Confirm Delete</Text>}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack>
						{flavour === 'delete' && <Text>Are you sure you want to delete this entity?</Text>}
						{!!error && <ErrorAlert info={{ label: 'Something went wrong', reason: error }} />}
					</VStack>
				</ModalBody>

				<ModalFooter>
					{flavour === 'delete' && (
						<Button
							colorScheme="red"
							leftIcon={<Icon as={Trash} weight="bold" boxSize={6} />}
							mr={3}
							onClick={onConfirm}
							isLoading={isLoading}
						>
							I confirm, delete
						</Button>
					)}
					<Button colorScheme="gray" onClick={onClose}>
						Cancel
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}
