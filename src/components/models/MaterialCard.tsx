import {
	Box,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Flex,
	Heading,
	Icon,
	IconButton,
	Text,
	useDisclosure,
} from '@chakra-ui/react'
import { ElementTag } from './ElementTag'
import { Material } from '../../models/Material'
import React from 'react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { useDeleteMaterialMutation } from '../../services/material'
import { ConfirmModal } from '../modals/ConfirmModal'
import { useIsMobileLayout } from '../../hooks/responsive-size'
import { DetailedMaterialModal } from './DetailedMaterialModal'
import { MdEdit } from 'react-icons/md'
import { AddBoxFormModal } from '../modals/AddBoxFormModal'

interface MaterialCardProps {
	material: Material
	isCompact: boolean
}

export const MaterialCard = ({ material, isCompact }: MaterialCardProps) => {
	const isMobile = useIsMobileLayout()
	const [deleteMaterial, { error: deleteError, isLoading: deleteIsLoading }] = useDeleteMaterialMutation()
	const { onOpen: deleteModalOpen, onClose: deleteModalClose, isOpen: deleteModalIsOpen } = useDisclosure()
	const { isOpen: detailsOpen, onOpen: openDetails, onClose: detailsClose } = useDisclosure()
	const { isOpen: addBoxIsOpen, onOpen: onOpenAddBox, onClose: onCloseAddBox } = useDisclosure()

	const compressTagsThreshold = isCompact || isMobile ? 5 : 10

	return (
		<>
			<Card boxShadow="none" width="100%">
				<CardHeader
					_hover={{ cursor: !isMobile ? 'pointer' : 'default' }}
					onClick={!isMobile ? openDetails : undefined}
				>
					<Flex justifyContent="space-between">
						<Box>
							<Heading size="md">{material.name}</Heading>
							{!!material.referenceCode && <Text>RefCode: {material.referenceCode}</Text>}
						</Box>
						{isCompact && (
							<IconButton
								onClick={deleteModalOpen}
								aria-label="delete material"
								icon={<DeleteIcon />}
								colorScheme="red"
								variant="ghost"
							/>
						)}
						{isMobile && (
							<IconButton
								onClick={openDetails}
								aria-label="material settings"
								icon={<Icon as={MdEdit} boxSize={6} />}
								variant="ghost"
							/>
						)}
					</Flex>
				</CardHeader>
				{!!material.description && (
					<CardBody
						paddingTop="0px"
						_hover={{ cursor: !isMobile ? 'pointer' : 'default' }}
						onClick={!isMobile ? openDetails : undefined}
					>
						<Text>{material.description}</Text>
						{!!material.tags && material.tags.length > 0 && (
							<Flex align="center" justify="start" mt="1em">
								{material.tags.map(id => (
									<ElementTag
										key={id}
										tagId={id}
										marginRight="0.4em"
										compact={!!material.tags && material.tags.length >= compressTagsThreshold}
									/>
								))}
							</Flex>
						)}
					</CardBody>
				)}
				{!isCompact && (
					<CardFooter paddingTop="0px">
						<Flex width="full" justifyContent="space-between">
							<Button colorScheme="green" leftIcon={<AddIcon />} onClick={onOpenAddBox}>
								Add a Box
							</Button>
							<Button colorScheme="red" leftIcon={<DeleteIcon />} onClick={deleteModalOpen}>
								Delete
							</Button>
						</Flex>
					</CardFooter>
				)}
			</Card>
			<AddBoxFormModal onClose={onCloseAddBox} isOpen={addBoxIsOpen} material={material} />
			<ConfirmModal
				onClose={deleteModalClose}
				isOpen={deleteModalIsOpen}
				isLoading={deleteIsLoading}
				flavour="delete"
				error={deleteError}
				onConfirm={() => {
					deleteMaterial(material)
				}}
			/>
			<DetailedMaterialModal material={material} isOpen={detailsOpen} onClose={detailsClose} />
		</>
	)
}
