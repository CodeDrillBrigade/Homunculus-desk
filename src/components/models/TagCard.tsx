import {
	Box,
	Card,
	CardBody,
	CardHeader,
	Flex,
	Heading,
	Icon,
	IconButton,
	LayoutProps,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	SpaceProps,
	Text,
	useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { Tag as MetaTag } from '../../models/embed/Tag'
import { DotsThreeVertical, PencilSimple, Trash } from '@phosphor-icons/react'
import { useDeleteTagMutation, useModifyTagMutation } from '../../services/tag'
import { ConfirmModal } from '../modals/ConfirmModal'
import { AddTagModal } from '../modals/AddTagModal'

interface TagCardProps extends SpaceProps, LayoutProps {
	tag: MetaTag
}

export const TagCard = ({ tag }: TagCardProps) => {
	const { isOpen: deleteModalIsOpen, onClose: deleteModalClose, onOpen: deleteModalOpen } = useDisclosure()
	const { isOpen: modifyModalIsOpen, onClose: modifyModalClose, onOpen: modifyModalOpen } = useDisclosure()

	const [deleteTag, { isLoading: deleteIsLoading, error: deleteError }] = useDeleteTagMutation()
	const [modifyTag, { isLoading: modifyLoading, error: modifyError, isSuccess: modifySuccess, reset: modifyReset }] =
		useModifyTagMutation()

	return (
		<Card>
			<CardHeader>
				<Flex justifyContent="space-between" alignItems="center">
					<Heading size="md">{tag.name}</Heading>
					<Menu>
						<MenuButton
							as={IconButton}
							aria-label="options"
							icon={<Icon as={DotsThreeVertical} weight="bold" boxSize={5} />}
							variant="ghost"
							mt="0px"
						/>
						<MenuList>
							<MenuItem
								icon={<Icon as={PencilSimple} weight="bold" boxSize={5} />}
								onClick={modifyModalOpen}
							>
								<Text>Edit</Text>
							</MenuItem>
							<MenuItem icon={<Icon as={Trash} weight="bold" boxSize={5} />} onClick={deleteModalOpen}>
								<Text>Delete</Text>
							</MenuItem>
						</MenuList>
					</Menu>
				</Flex>
			</CardHeader>
			<CardBody pt="0px">
				<Flex alignItems="center">
					<Box bg={tag.color} width="20px" height="20px" borderRadius="md" mr={2}></Box>
					<Text>{tag.color}</Text>
				</Flex>
			</CardBody>
			<ConfirmModal
				onClose={deleteModalClose}
				isOpen={deleteModalIsOpen}
				isLoading={deleteIsLoading}
				flavour="delete"
				error={deleteError}
				onConfirm={() => {
					deleteTag(tag._id)
				}}
			/>
			<AddTagModal
				action={updates => modifyTag({ ...tag, ...updates })}
				isSuccessful={modifySuccess}
				isLoading={modifyLoading}
				reset={modifyReset}
				error={modifyError}
				isOpen={modifyModalIsOpen}
				onClose={modifyModalClose}
				initialState={{ name: tag.name, color: tag.color }}
			/>
		</Card>
	)
}
