import { Material } from '../../models/Material'
import { Box as BoxEntity } from '../../models/Box'
import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Container,
	Flex,
	Icon,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Skeleton,
	Text,
	Tooltip,
	useColorMode,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { EditableTextInput } from '../forms/controls/EditableTextInput'
import { ErrorAlert } from '../errors/ErrorAlert'
import { TagInput } from '../forms/controls/TagInput'
import { BoxDefinitionDisplay } from './BoxDefinitionDisplay'
import React, { useCallback, useEffect, useState } from 'react'
import { FormValues, useForm } from '../../hooks/form'
import { useGetTagsByIdsQuery } from '../../services/tag'
import { useGetBoxDefinitionQuery } from '../../services/boxDefinition'
import { FormValue } from '../../models/form/FormValue'
import { Tag } from '../../models/embed/Tag'
import { useIsMobileLayout } from '../../hooks/responsive-size'
import { CheckCircleIcon, DeleteIcon, WarningIcon } from '@chakra-ui/icons'
import { useModifyMaterialMutation } from '../../services/material'
import { extractErrorMessage } from '../../utils/error-utils'
import { useDeleteBoxMutation, useGetBoxWithMaterialQuery } from '../../services/box'
import { QuantityCounter } from './QuantityCounter'
import { useGetStorageRoomsQuery } from '../../services/storageRoom'
import { readableNameFromId } from '../../utils/storage-room-utils'
import { UpdateBoxFormModal } from '../modals/UpdateBoxFormModal'
import { FiUpload } from 'react-icons/fi'
import { ConfirmModal } from '../modals/ConfirmModal'

interface UpdateMaterialFormValues extends FormValues {
	name: FormValue<string>
	description: FormValue<string>
	referenceCode: FormValue<string>
	brand: FormValue<string>
	tags: FormValue<Tag[]>
}

const initialState: UpdateMaterialFormValues = {
	name: { value: undefined, isValid: true },
	description: { value: undefined, isValid: true },
	referenceCode: { value: undefined, isValid: true },
	brand: { value: undefined, isValid: true },
	tags: { value: undefined, isValid: true },
}

interface DetailedMaterialModalProps {
	onClose: () => void
	isOpen: boolean
	material: Material
}

export const DetailedMaterialModal = ({ material, isOpen, onClose }: DetailedMaterialModalProps) => {
	const isMobile = useIsMobileLayout()
	const { colorMode } = useColorMode()
	const { formState, dispatchState, isInvalid } = useForm({ initialState })
	const formIsTouched = Object.values(formState).some(it => !!it.value)
	const [selectedBox, setSelectedBox] = useState<BoxEntity | undefined>()
	const [boxToDelete, setBoxToDelete] = useState<BoxEntity | undefined>()
	const { isOpen: updateModalIsOpen, onOpen: updateModalOpen, onClose: updateModalClose } = useDisclosure()
	const { onOpen: deleteBoxModalOpen, onClose: deleteBoxModalClose, isOpen: deleteBoxModalIsOpen } = useDisclosure()

	const {
		data: tags,
		error: tagsError,
		isLoading: tagsLoading,
	} = useGetTagsByIdsQuery(material.tags ?? [], { skip: !material.tags || material.tags.length === 0 })
	const {
		data: boxDefinition,
		error: boxDefinitionError,
		isLoading: boxDefinitionLoading,
	} = useGetBoxDefinitionQuery(material.boxDefinition)
	const [modifyMaterial, { error: modifyError, isLoading: modifyLoading, isSuccess: modifySuccess }] =
		useModifyMaterialMutation()
	const { data: boxes, error: boxesError, isLoading: boxesLoading } = useGetBoxWithMaterialQuery(material._id)
	const { data: storageRooms } = useGetStorageRoomsQuery()
	const [deleteBox, { error: deleteBoxError, isLoading: deleteBoxLoading, isSuccess: deleteBoxSuccess }] =
		useDeleteBoxMutation()

	const totalInBoxes = !!boxes ? boxes.reduce((acc, el) => acc + el.quantity.quantity, 0) : undefined

	useEffect(() => {
		if (deleteBoxSuccess) {
			setBoxToDelete(undefined)
			deleteBoxModalClose()
		}
	}, [deleteBoxSuccess, deleteBoxModalClose])

	const onMaterialUpdate = useCallback(
		(formState: UpdateMaterialFormValues) => {
			const updatedMaterial: Material = {
				...material,
				name: formState.name.isValid && !!formState.name.value ? formState.name.value : material.name,
				description: formState.description.value ?? material.description,
				referenceCode: formState.referenceCode.value ?? material.referenceCode,
				brand: formState.brand.value ?? material.brand,
				tags: formState.tags?.value?.map(it => it._id) ?? material.tags,
			}
			modifyMaterial(updatedMaterial)
		},
		[material, modifyMaterial]
	)

	return (
		<Modal isOpen={isOpen} onClose={onClose} size={isMobile ? 'full' : 'xl'}>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<ModalHeader>{material.name}</ModalHeader>

				<ModalBody>
					<EditableTextInput
						label=""
						placeholder="Name"
						defaultValue={material.name}
						validator={input => !!input && input.length > 0}
						valueConsumer={payload => {
							dispatchState('name', payload)
						}}
						invalidLabel="Name is required"
					/>
					<EditableTextInput
						label=""
						placeholder="Description"
						defaultValue={material.description}
						valueConsumer={payload => {
							dispatchState('description', payload)
						}}
					/>
					<EditableTextInput
						label="Reference Code"
						placeholder="Reference Code"
						defaultValue={material.referenceCode}
						mt="2em"
						valueConsumer={payload => {
							dispatchState('referenceCode', payload)
						}}
					/>
					<EditableTextInput
						label="Brand"
						placeholder="Brand"
						defaultValue={material.brand}
						mt="1em"
						valueConsumer={payload => {
							dispatchState('brand', payload)
						}}
					/>
					{!!tagsError && (
						<ErrorAlert info={{ label: 'Cannot load the tags for this material', reason: tagsError }} />
					)}
					{tagsLoading && (
						<Container width="100%" mt="1em">
							<Skeleton height="4vh" borderRadius="md" />
						</Container>
					)}
					{(!material.tags || material.tags.length === 0 || !!tags) && (
						<TagInput
							label="Tags"
							defaultValue={!material.tags || material.tags.length === 0 ? [] : tags}
							forcedSize={isMobile ? 3 : 5}
							mt="1em"
							valueConsumer={payload => {
								dispatchState('tags', payload)
							}}
						/>
					)}
					<Text>Each box contains:</Text>
					{!!boxDefinitionError && (
						<ErrorAlert
							info={{
								label: 'Cannot load the box structure for this material',
								reason: boxDefinitionError,
							}}
						/>
					)}
					{boxDefinitionLoading && (
						<Container width="100%" mt="1em">
							<Skeleton height="4vh" borderRadius="md" />
						</Container>
					)}
					{!!boxDefinition && <BoxDefinitionDisplay boxDefinition={boxDefinition} mt="0.5em" />}
					<Box mt="1em">
						<Text as="b">Total of the boxes available:</Text>
						{!!boxesError && (
							<ErrorAlert
								info={{ label: 'Cannot load the boxes for this material', reason: boxesError }}
							/>
						)}
						{(boxesLoading || boxDefinitionLoading) && (
							<Container width="100%" mt="1em">
								<Skeleton height="4vh" borderRadius="md" />
							</Container>
						)}
						{!!boxDefinition && !!totalInBoxes && (
							<QuantityCounter quantity={totalInBoxes} boxDefinition={boxDefinition} mt="0.5em" />
						)}
					</Box>
					{!!boxes && (
						<Accordion marginTop="1em" allowToggle>
							<AccordionItem>
								<h2>
									<AccordionButton>
										<AccordionIcon marginRight="1em" />
										<Box as="span" flex="1" textAlign="left">
											Current available boxes:
										</Box>
									</AccordionButton>
								</h2>
								<AccordionPanel pb={4}>
									<VStack justifyContent="left" width="100%">
										{boxes.map((box, idx) => (
											<Card
												key={box._id}
												width="100%"
												boxShadow="none"
												backgroundColor={colorMode === 'dark' ? 'blue.600' : 'blue.200'}
											>
												<CardHeader pb="0px">
													<Text as="b">
														{`#${!!box.batchNumber ? box.batchNumber : idx}`} -{' '}
														{readableNameFromId(storageRooms ?? [], box.position)}
													</Text>
												</CardHeader>
												<CardBody pt="0.5em" pb="0px">
													{!!boxDefinition && (
														<QuantityCounter
															quantity={box.quantity.quantity}
															boxDefinition={boxDefinition}
														/>
													)}
												</CardBody>
												<CardFooter pt="0.5em">
													<Flex width="full" justifyContent="space-between">
														<Button
															colorScheme="blue"
															leftIcon={<Icon as={FiUpload} />}
															onClick={() => {
																setSelectedBox(box)
																updateModalOpen()
															}}
															isDisabled={!boxDefinition?.boxUnit}
														>
															Use/Add
														</Button>
														<Button
															colorScheme="red"
															leftIcon={<DeleteIcon />}
															onClick={() => {
																setBoxToDelete(box)
																deleteBoxModalOpen()
															}}
														>
															Delete
														</Button>
													</Flex>
												</CardFooter>
											</Card>
										))}
									</VStack>
								</AccordionPanel>
							</AccordionItem>
						</Accordion>
					)}
				</ModalBody>

				<ModalFooter>
					<Flex width="full" justifyContent="start">
						<Flex>
							<Button
								colorScheme="blue"
								isDisabled={isInvalid || !formIsTouched}
								isLoading={modifyLoading}
								onClick={() => {
									onMaterialUpdate(formState)
								}}
							>
								Update Material
							</Button>
							{modifySuccess && <CheckCircleIcon boxSize={6} color="green.400" mt="0.5em" ml="0.5em" />}
							{!!modifyError && (
								<Tooltip label={extractErrorMessage(modifyError)} fontSize="md">
									<WarningIcon boxSize={6} color="red.400" mt="0.5em" ml="0.5em" />
								</Tooltip>
							)}
						</Flex>
					</Flex>
				</ModalFooter>
			</ModalContent>
			{!!boxToDelete && (
				<ConfirmModal
					onClose={() => {
						setSelectedBox(undefined)
						deleteBoxModalClose()
					}}
					isOpen={deleteBoxModalIsOpen}
					isLoading={deleteBoxLoading}
					flavour="delete"
					error={deleteBoxError}
					onConfirm={() => {
						deleteBox(boxToDelete)
					}}
				/>
			)}
			{!!boxDefinition?.boxUnit && !!selectedBox && (
				<UpdateBoxFormModal
					isOpen={updateModalIsOpen}
					onClose={() => {
						setSelectedBox(undefined)
						updateModalClose()
					}}
					box={selectedBox}
					material={material}
					boxDefinition={boxDefinition.boxUnit}
				/>
			)}
		</Modal>
	)
}
