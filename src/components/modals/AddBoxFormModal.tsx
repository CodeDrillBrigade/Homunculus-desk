import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import { Material } from '../../models/Material'
import { AddBoxForm } from '../box/AddBoxForm'
import { useIsMobileLayout } from '../../hooks/responsive-size'

interface AddBoxFormModalProps {
	onClose: () => void
	isOpen: boolean
	material?: Material
	position?: {
		id: string
		name: string
	}
}

export const AddBoxFormModal = ({ onClose, isOpen, material, position }: AddBoxFormModalProps) => {
	const isMobile = useIsMobileLayout()
	return (
		<Modal isOpen={isOpen} onClose={onClose} size={isMobile ? 'full' : 'xl'}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					<Text>
						Add a new box{!!material ? ` of ${material.name}` : ''}
						{!!position ? `in ${position.name}` : ''}
					</Text>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody pt="0px">
					<AddBoxForm
						defaultMaterial={material}
						defaultPosition={position?.id}
						onDispatchSuccess={onClose}
						mt="0px"
					/>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}
