import {
	Avatar,
	Button,
	Flex,
	Heading,
	HStack,
	Icon,
	IconButton,
	Menu,
	MenuButton,
	MenuDivider,
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
import { useGetCurrentUserQuery } from '../../services/user'
import { Permissions } from '../../models/security/Permissions'
import { ChangePasswordModal } from '../modals/ChangePasswordModal'
import React, { useEffect } from 'react'
import { InviteModal } from '../modals/InviteModal'
import { jwtSelector } from '../../store/auth/auth-slice'
import { ContinueRegistrationModal } from '../modals/ContinueRegistrationModal'
import { UserStatus } from '../../models/embed/UserStatus'
import { pageTitleSelector } from '../../store/ui/ui-slice'
import { useIsMobileLayout } from '../../hooks/responsive-size'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExclamationMark, House, SignOut } from '@phosphor-icons/react'
import { UserAvatar } from './UserAvatar'
import { useHasPermission } from '../../hooks/permissions'

export const TopMenu = () => {
	const isMobile = useIsMobileLayout()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const hasPermission = useHasPermission()

	const jwt = useAppSelector(jwtSelector)
	const pageTitle = useAppSelector(pageTitleSelector)
	const { isOpen: passwordChangeIsOpen, onOpen: openPasswordChange, onClose: closePasswordChange } = useDisclosure()
	const { isOpen: inviteIsOpen, onOpen: openInvite, onClose: closeInvite } = useDisclosure()
	const {
		isOpen: completeRegistrationIsOpen,
		onOpen: openCompleteRegistration,
		onClose: closeCompleteRegistration,
	} = useDisclosure()
	const { data: user, error, isLoading } = useGetCurrentUserQuery(undefined, { skip: !jwt })

	useEffect(() => {
		if (!!user && user.status === UserStatus.REGISTERING) {
			openCompleteRegistration()
		} else if (!!user && !user.passwordHash) {
			openPasswordChange()
		}
	}, [openCompleteRegistration, openPasswordChange, user])

	return (
		<>
			<Flex
				as="header"
				p="10px"
				alignItems="center"
				mb="1em"
				w="99vw"
				h="8vh"
				position="fixed"
				zIndex="sticky"
				backdropFilter="saturate(100%) blur(10px)"
			>
				<HStack>
					{!!user && (
						<>
							{pathname !== '/' && (
								<IconButton
									variant="clear"
									aria-label="Go back"
									fontSize="25px"
									icon={<Icon as={ArrowLeft} weight="bold" />}
									onClick={() => navigate(-1)}
								/>
							)}
							<Menu>
								<MenuButton>
									<UserAvatar user={user} showWarning={true} />
								</MenuButton>
								<MenuList>
									{isMobile && (
										<>
											<MenuItem _hover={{ background: 'none' }}>
												{user.name ?? user.username}
											</MenuItem>
											<MenuDivider />
										</>
									)}
									<MenuItem
										onClick={() => navigate('/')}
										icon={<Icon as={House} weight="bold" boxSize={5} />}
									>
										Home
									</MenuItem>
									<MenuDivider />
									{user.status === UserStatus.ACTIVE && (
										<MenuItem
											icon={
												!user.passwordHash ? (
													<Icon
														as={ExclamationMark}
														boxSize={5}
														borderRadius="full"
														backgroundColor="red.400"
													/>
												) : undefined
											}
											onClick={openPasswordChange}
										>
											Change Password
										</MenuItem>
									)}
									{user.status === UserStatus.ACTIVE && (
										<MenuItem onClick={() => navigate('/user')}>Modify User Details</MenuItem>
									)}
									{user.status === UserStatus.REGISTERING && (
										<MenuItem
											onClick={openCompleteRegistration}
											icon={
												<Icon
													as={ExclamationMark}
													weight="bold"
													boxSize={5}
													borderRadius="full"
													backgroundColor="red.400"
												/>
											}
										>
											Complete Registration
										</MenuItem>
									)}
									{user.status === UserStatus.ACTIVE && hasPermission(Permissions.ADMIN) && (
										<MenuItem onClick={openInvite}>Invite User</MenuItem>
									)}
									{isMobile && (
										<MenuItem
											onClick={() => {
												dispatch(resetToken())
											}}
											icon={<Icon as={SignOut} weight="bold" boxSize={5} />}
										>
											Logout
										</MenuItem>
									)}
									<MenuItem _hover={{ background: 'none' }}>
										<DarkMode />
									</MenuItem>
								</MenuList>
							</Menu>
							{!isMobile && <Text>{user.name ?? user.username}</Text>}
						</>
					)}
					{(isLoading || !jwt) && <SkeletonCircle size="12" />}
					{!!error && (
						<Tooltip label={`Cannot load the user: ${JSON.stringify(error)}`} aria-label="Error tooltip">
							<Avatar bg="red.400" icon={<Icon as={ExclamationMark} weight="bold" boxSize={9} />} />
						</Tooltip>
					)}
				</HStack>
				<Spacer />
				<Heading>{pageTitle}</Heading>
				<Spacer />
				{!isMobile && (
					<Button
						colorScheme={'orange'}
						onClick={() => {
							dispatch(resetToken())
						}}
						rightIcon={<Icon as={SignOut} weight="bold" boxSize={7} />}
					>
						Logout
					</Button>
				)}
			</Flex>
			<Flex as="header" w="100vw" h="8vh" mb="1em"></Flex>
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
