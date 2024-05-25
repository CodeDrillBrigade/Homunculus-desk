import {
	Box,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Flex,
	Heading,
	IconButton,
	Text,
	useDisclosure,
} from '@chakra-ui/react'
import { ElementTag } from './ElementTag'
import { Material } from '../../models/Material'
import React from 'react'
import { DeleteIcon } from '@chakra-ui/icons'
import { useDeleteMaterialMutation } from '../../services/material'
import { ConfirmModal } from '../modals/ConfirmModal'
import { QueryStatus } from '@reduxjs/toolkit/query'

export const MaterialCard = ({ material }: { material: Material }) => {
	const [deleteMaterial, { error: deleteError, status: deleteStatus }] = useDeleteMaterialMutation()
	const { onOpen: deleteModalOpen, onClose: deleteModalClose, isOpen: deleteModalIsOpen } = useDisclosure()
	return (
		<>
			<Card boxShadow="none" width="100%">
				<CardHeader>
					<Flex justifyContent="space-between">
						<Box>
							<Heading size="md">{material.name}</Heading>
							{!!material.referenceCode && <Text>RefCode: {material.referenceCode}</Text>}
						</Box>
						<IconButton
							onClick={deleteModalOpen}
							aria-label="delete material"
							icon={<DeleteIcon />}
							colorScheme="red"
							variant="ghost"
						/>
					</Flex>
				</CardHeader>
				{!!material.description && (
					<CardBody paddingTop="0px">
						<Text>{material.description}</Text>
					</CardBody>
				)}
				{!!material.tags && material.tags.length > 0 && (
					<CardFooter paddingTop="0px">
						<Flex>
							{material.tags.map(id => (
								<ElementTag
									key={id}
									tagId={id}
									marginRight="0.4em"
									compact={!!material.tags && material.tags.length >= 5}
								/>
							))}
						</Flex>
					</CardFooter>
				)}
			</Card>
			<ConfirmModal
				onClose={deleteModalClose}
				isOpen={deleteModalIsOpen}
				isLoading={deleteStatus === QueryStatus.pending}
				flavour="delete"
				error={deleteError}
				onConfirm={() => {
					deleteMaterial(material)
				}}
			/>
		</>
	)
}
