import {
	Avatar,
	AvatarBadge,
	Box,
	Button,
	Flex,
	HStack,
	Icon,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	SkeletonCircle,
	Spacer,
	Text,
	Tooltip,
	useDisclosure,
} from '@chakra-ui/react'
import { DarkMode } from './DarkMode'
import { resetToken } from '../../store/auth/auth-thunk'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { useGetCurrentUserQuery, useGetPermissionsQuery } from '../../services/user'
import { BsExclamationLg } from 'react-icons/bs'
import { TbLogout } from 'react-icons/tb'
import { PERMISSIONS } from '../../models/security/Permissions'
import { ChangePasswordModal } from '../modals/ChangePasswordModal'
import { useEffect } from 'react'
import { InviteModal } from '../modals/InviteModal'
import { jwtSelector } from '../../store/auth/auth-slice'
import { ContinueRegistrationModal } from '../modals/ContinueRegistrationModal'
import { UserStatus } from '../../models/embed/UserStatus'

export const TopMenu = () => {
	const dispatch = useAppDispatch()
	const jwt = useAppSelector(jwtSelector)
	const { isOpen: passwordChangeIsOpen, onOpen: openPasswordChange, onClose: closePasswordChange } = useDisclosure()
	const { isOpen: inviteIsOpen, onOpen: openInvite, onClose: closeInvite } = useDisclosure()
	const {
		isOpen: completeRegistrationIsOpen,
		onOpen: openCompleteRegistration,
		onClose: closeCompleteRegistration,
	} = useDisclosure()
	const { data: user, error, isLoading } = useGetCurrentUserQuery(undefined, { skip: !jwt })
	const {
		data: permissions,
		error: permissionsError,
		isLoading: permissionsLoading,
	} = useGetPermissionsQuery(undefined, { skip: !jwt })

	useEffect(() => {
		if (!!user && user.status === UserStatus.REGISTERING) {
			openCompleteRegistration()
		} else if (!!user && !user.passwordHash) {
			openPasswordChange()
		}
	}, [openCompleteRegistration, openPasswordChange, user])

	return (
		<>
			<Flex as={'nav'} p={'10px'} alignItems={'center'}>
				<HStack>
					{!!user && !!permissions && (
						<>
							<Menu>
								<MenuButton>
									<Avatar name={user.name ?? user.username}>
										{(!user.passwordHash || user.status === UserStatus.REGISTERING) && (
											<AvatarBadge boxSize="1.25em" bg="red.400">
												<Icon as={BsExclamationLg} boxSize="0.6em" />
											</AvatarBadge>
										)}
									</Avatar>
								</MenuButton>
								<MenuList>
									{user.status === UserStatus.ACTIVE && (
										<MenuItem onClick={openPasswordChange}>
											{!user.passwordHash && (
												<Box bg="red.400" borderRadius="full" width="1.9em" mr="1em">
													<Icon as={BsExclamationLg} boxSize={5} ml="0.35em" mt="0.3em" />
												</Box>
											)}{' '}
											Change Password
										</MenuItem>
									)}
									{user.status === UserStatus.REGISTERING && (
										<MenuItem onClick={openCompleteRegistration}>
											<Box bg="red.400" borderRadius="full" width="1.9em" mr="1em">
												<Icon as={BsExclamationLg} boxSize={5} ml="0.35em" mt="0.3em" />
											</Box>{' '}
											Complete Registration
										</MenuItem>
									)}
									{user.status === UserStatus.ACTIVE && permissions.includes(PERMISSIONS.ADMIN) && (
										<MenuItem onClick={openInvite}>Invite User</MenuItem>
									)}
								</MenuList>
							</Menu>
							<Text>{user.name ?? user.username}</Text>
						</>
					)}
					{(isLoading || permissionsLoading || !jwt) && <SkeletonCircle size="12" />}
					{(!!error || !!permissionsError) && (
						<Tooltip
							label={`Cannot load the user: ${JSON.stringify(error ?? permissionsError)}`}
							aria-label="Error tooltip"
						>
							<Avatar bg="red.400" icon={<Icon as={BsExclamationLg} boxSize={9} />} />
						</Tooltip>
					)}
				</HStack>
				<Spacer />
				<DarkMode />
				<Spacer />
				<Button
					colorScheme={'orange'}
					onClick={() => {
						dispatch(resetToken())
					}}
					rightIcon={<Icon as={TbLogout} boxSize={7} />}
				>
					Logout
				</Button>
			</Flex>
			{!!user && <ChangePasswordModal isOpen={passwordChangeIsOpen} onClose={closePasswordChange} user={user} />}
			{!!user && (
				<ContinueRegistrationModal
					isOpen={completeRegistrationIsOpen}
					onClose={closeCompleteRegistration}
					user={user}
				/>
			)}
			<InviteModal isOpen={inviteIsOpen} onClose={closeInvite} />
		</>
	)
}
