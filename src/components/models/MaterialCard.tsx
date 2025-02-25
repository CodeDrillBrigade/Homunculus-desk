import {
	Box,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Container,
	Flex,
	Heading,
	Icon,
	IconButton,
	Text,
	Tooltip,
	useDisclosure,
} from '@chakra-ui/react'
import { ElementTag } from './ElementTag'
import { Material } from '../../models/Material'
import React from 'react'
import { useDeleteMaterialMutation } from '../../services/material'
import { ConfirmModal } from '../modals/ConfirmModal'
import { useIsMobileLayout } from '../../hooks/responsive-size'
import { DetailedMaterialModal } from './DetailedMaterialModal'
import { AddBoxFormModal } from '../modals/AddBoxFormModal'
import { ExclamationMark, PencilSimple, Plus, Trash } from '@phosphor-icons/react'
import { useHasPermission } from '../../hooks/permissions'
import { Permissions } from '../../models/security/Permissions'
import { useDeleteBoxesWithMaterialMutation, useGetUnitsWithMaterialQuery } from '../../services/box'
import { useGetBoxDefinitionQuery } from '../../services/boxDefinition'
import { QuantityCounter } from './QuantityCounter'

interface MaterialCardProps {
	material: Material
	isCompact: boolean
}

export const MaterialCard = ({ material, isCompact }: MaterialCardProps) => {
	const isMobile = useIsMobileLayout()
	const hasPermission = useHasPermission()

	const [deleteMaterial, { error: deleteError, isLoading: deleteIsLoading }] = useDeleteMaterialMutation()
	const [deleteBoxesByMaterial] = useDeleteBoxesWithMaterialMutation()
	const { data: totalInBoxes } = useGetUnitsWithMaterialQuery(material._id)
	const { data: boxDefinition } = useGetBoxDefinitionQuery(material.boxDefinition)

	const { onOpen: deleteModalOpen, onClose: deleteModalClose, isOpen: deleteModalIsOpen } = useDisclosure()
	const { isOpen: detailsOpen, onOpen: openDetails, onClose: detailsClose } = useDisclosure()
	const { isOpen: addBoxIsOpen, onOpen: onOpenAddBox, onClose: onCloseAddBox } = useDisclosure()

	const compressTagsThreshold = isCompact || isMobile ? 5 : 10

	return (
		<>
			<Card boxShadow="none" width="100%">
				<CardHeader
					_hover={{ cursor: !isMobile && !isCompact ? 'pointer' : 'default' }}
					onClick={!isMobile && !isCompact ? openDetails : undefined}
				>
					<Flex justifyContent="space-between">
						<Box>
							<Heading size="md">{material.name}</Heading>
							{!!material.referenceCode && <Text>RefCode: {material.referenceCode}</Text>}
						</Box>
						{isCompact && hasPermission(Permissions.MANAGE_MATERIALS) && (
							<IconButton
								onClick={deleteModalOpen}
								aria-label="delete material"
								icon={<Icon as={Trash} weight="fill" boxSize={5} />}
								colorScheme="red"
								variant="ghost"
							/>
						)}
						{isMobile && (
							<IconButton
								onClick={openDetails}
								aria-label="material settings"
								icon={<Icon as={PencilSimple} weight="bold" boxSize={6} />}
								variant="ghost"
							/>
						)}
					</Flex>
				</CardHeader>
				{(!!material.description || !!material.tags) && (
					<CardBody
						paddingTop="0px"
						_hover={{ cursor: !isMobile ? 'pointer' : 'default' }}
						onClick={!isMobile ? openDetails : undefined}
					>
						{!!material.description && <Text>{material.description}</Text>}
						{!!boxDefinition && totalInBoxes != null && (
							<Flex>
								<QuantityCounter quantity={totalInBoxes} boxDefinition={boxDefinition} mt="0.5em" />
								{totalInBoxes === 0 && (
									<Tooltip label="No units left for this material">
										<Container
											borderRadius="full"
											backgroundColor="red"
											width="1.7em"
											height="1.7em"
											paddingTop="0.15em"
											paddingLeft="0.1em"
											marginLeft="1em"
											marginTop="0.5em"
										>
											<Icon as={ExclamationMark} boxSize={6} />
										</Container>
									</Tooltip>
								)}
							</Flex>
						)}
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
				{!isCompact && hasPermission(Permissions.MANAGE_MATERIALS) && (
					<CardFooter paddingTop="0px">
						<Flex width="full" justifyContent="space-between">
							<Button
								colorScheme="green"
								leftIcon={<Icon as={Plus} weight="bold" boxSize={6} />}
								onClick={onOpenAddBox}
							>
								Add a Box
							</Button>
							<Button
								colorScheme="red"
								leftIcon={<Icon as={Trash} weight="bold" boxSize={6} />}
								onClick={deleteModalOpen}
							>
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
					deleteBoxesByMaterial(material._id)
				}}
			/>
			<DetailedMaterialModal material={material} isOpen={detailsOpen} onClose={detailsClose} />
		</>
	)
}
