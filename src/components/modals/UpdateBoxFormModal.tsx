import { Box as BoxModel } from '../../models/Box'
import { Material } from '../../models/Material'
import { BoxUnit } from '../../models/embed/BoxUnit'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import { UpdateQuantityForm } from '../forms/UpdateQuantityForm'

interface UpdateBoxFormModalProps {
	isOpen: boolean
	onClose: () => void
	box: BoxModel
	material: Material
	boxDefinition: BoxUnit
}

export const UpdateBoxFormModal = ({ isOpen, onClose, box, material, boxDefinition }: UpdateBoxFormModalProps) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					Update {material.name}, batch {box.batchNumber}
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody paddingBottom="1em">
					<UpdateQuantityForm box={box} boxDefinition={boxDefinition} onDispatched={onClose} />
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}
