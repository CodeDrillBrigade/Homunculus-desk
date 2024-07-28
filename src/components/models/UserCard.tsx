import {
	Box,
	Button,
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
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	SpaceProps,
	Text,
	useDisclosure,
} from '@chakra-ui/react'
import { User } from '../../models/User'
import { UserAvatar } from '../ui/UserAvatar'
import {
	Envelope,
	Question,
	UserCircleCheck,
	UserCircleDashed,
	UserCircleMinus,
	User as UserIcon,
	ChefHat,
	Toolbox,
	DotsThreeVertical,
	PencilSimple,
	Trash,
	Prohibit,
	Power,
} from '@phosphor-icons/react'
import { UserStatus } from '../../models/embed/UserStatus'
import { capitalize } from '../../utils/string-utils'
import { useGetRoleQuery } from '../../services/role'
import { Role } from '../../models/embed/Role'
import React, { useCallback, useState } from 'react'
import { ErrorAlert } from '../errors/ErrorAlert'
import { useDeleteUserMutation, useModifyUserRoleMutation, useSetUserStatusMutation } from '../../services/user'
import { RoleSelector } from '../forms/controls/RoleSelector'
import { FormValue } from '../../models/form/FormValue'
import { ConfirmModal } from '../modals/ConfirmModal'

interface UserCardProps extends SpaceProps, LayoutProps {
	user: User
}

const iconForStatus = (status?: UserStatus) => {
	switch (status) {
		case UserStatus.ACTIVE:
			return UserCircleCheck
		case UserStatus.INACTIVE:
			return UserCircleMinus
		case UserStatus.REGISTERING:
			return UserCircleDashed
		default:
			return Question
	}
}

const iconForRole = (role?: Role) => {
	switch (role?.name) {
		case 'Admin':
			return ChefHat
		case 'Inventory manager':
			return Toolbox
		case 'Basic user':
			return UserIcon
		default:
			return Question
	}
}

export const UserCard = ({ user, ...style }: UserCardProps) => {
	const [roleToUpdate, setRoleToUpdate] = useState<FormValue<string>>({ value: undefined, isValid: false })

	const { data: role } = useGetRoleQuery(user.role ?? '')
	const [setRole, { error: setRoleError, isLoading: setRoleIsLoading }] = useModifyUserRoleMutation()
	const [deleteUser, { error: deleteError, isLoading: deleteLoading }] = useDeleteUserMutation()
	const [setStatus] = useSetUserStatusMutation()

	const { isOpen: statusModalIsOpen, onOpen: statusModalOpen, onClose: statusModalClose } = useDisclosure()
	const { isOpen: deleteModalIsOpen, onClose: deleteModalClose, onOpen: deleteModalOpen } = useDisclosure()

	const onSetRole = useCallback(() => {
		if (roleToUpdate.isValid && !!roleToUpdate.value) {
			setRole({ userId: user._id, roleId: roleToUpdate.value })
			setRoleToUpdate({ value: undefined, isValid: false })
			statusModalClose()
		}
	}, [roleToUpdate.isValid, roleToUpdate.value, setRole, statusModalClose, user._id])

	return (
		<Card {...style}>
			<CardHeader>
				<Flex width="full" justifyContent="space-between" alignItems="center">
					<Flex alignItems="center">
						<UserAvatar user={user} showWarning={false} size="md" mr="0.5em" />
						<Box>
							<Heading size="sm">
								{user.name} {user.surname}
							</Heading>
							<Text>@{user.username}</Text>
						</Box>
					</Flex>
					<Menu isLazy={true}>
						<MenuButton
							as={IconButton}
							aria-label="Options"
							icon={<Icon as={DotsThreeVertical} weight="bold" boxSize={6} />}
							variant="ghost"
						/>
						<MenuList>
							<MenuItem
								icon={<Icon as={PencilSimple} weight="bold" boxSize={5} />}
								onClick={statusModalOpen}
							>
								Change role
							</MenuItem>
							{user.status === UserStatus.REGISTERING && (
								<MenuItem
									icon={<Icon as={Trash} weight="bold" boxSize={5} />}
									onClick={deleteModalOpen}
								>
									Revoke invitation
								</MenuItem>
							)}
							{user.status === UserStatus.ACTIVE && (
								<MenuItem
									icon={<Icon as={Prohibit} weight="bold" boxSize={5} />}
									onClick={() => {
										setStatus({ userId: user._id, status: UserStatus.INACTIVE })
									}}
								>
									Deactivate User
								</MenuItem>
							)}
							{user.status === UserStatus.INACTIVE && (
								<MenuItem
									icon={<Icon as={Power} weight="bold" boxSize={5} />}
									onClick={() => {
										setStatus({ userId: user._id, status: UserStatus.ACTIVE })
									}}
								>
									Enable User
								</MenuItem>
							)}
						</MenuList>
					</Menu>
				</Flex>
			</CardHeader>
			<CardBody pt="0px">
				<Flex direction="column">
					<Flex alignItems="center">
						<Icon as={Envelope} boxSize={5} mr="0.3em" />
						<Box pb="0.1em">
							<Text>{user.email}</Text>
						</Box>
					</Flex>
					<Flex alignItems="center">
						<Icon as={iconForRole(role)} boxSize={5} mr="0.3em" />
						<Box pb="0.1em">
							<Text>{role?.name ?? 'Unknown role'}</Text>
						</Box>
					</Flex>
					<Flex alignItems="center">
						<Icon as={iconForStatus(user.status)} boxSize={5} mr="0.3em" />
						<Box pb="0.1em">
							<Text>{capitalize(user.status?.valueOf() ?? 'Unknown')}</Text>
						</Box>
					</Flex>
				</Flex>
			</CardBody>
			<ConfirmModal
				onClose={deleteModalClose}
				isOpen={deleteModalIsOpen}
				isLoading={deleteLoading}
				flavour="delete"
				error={deleteError}
				onConfirm={() => {
					deleteUser(user._id)
				}}
			/>
			<Modal isOpen={statusModalIsOpen} onClose={statusModalClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Update {user.name} role</ModalHeader>
					<ModalCloseButton />

					<ModalBody>
						{!!setRoleError && (
							<ErrorAlert info={{ label: 'Cannot set the role for the user', reason: setRoleError }} />
						)}
						<RoleSelector
							label="User role"
							validator={input => !!input}
							valueConsumer={setRoleToUpdate}
							invalidLabel="You must specify a valid role"
							defaultValue={user.role}
							mt="1em"
						/>
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							isDisabled={!roleToUpdate.isValid}
							isLoading={setRoleIsLoading}
							onClick={onSetRole}
						>
							Create
						</Button>
						<Button variant="ghost" onClick={statusModalClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Card>
	)
}
