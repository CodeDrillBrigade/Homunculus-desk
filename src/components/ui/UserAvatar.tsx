import { User } from '../../models/User'
import { Avatar, AvatarBadge, Icon, ResponsiveValue } from '@chakra-ui/react'
import { UserStatus } from '../../models/embed/UserStatus'
import { ExclamationMark } from '@phosphor-icons/react'
import React from 'react'
import { useGetProfilePictureQuery } from '../../services/profilePicture'

interface UserAvatarProps {
	user: User
	showWarning: boolean
	size?: ResponsiveValue<string>
}

export const UserAvatar = ({ user, showWarning, size }: UserAvatarProps) => {
	const { data: token } = useGetProfilePictureQuery(user.profilePicture ?? '', { skip: !user.profilePicture })
	return (
		<Avatar
			size={size}
			name={user.name ?? user.username}
			src={!!token ? `data:${token.type.toLowerCase()};base64,${token.content}` : undefined}
		>
			{(!user.passwordHash || user.status === UserStatus.REGISTERING) && showWarning && (
				<AvatarBadge boxSize="1.25em" bg="red.400">
					<Icon as={ExclamationMark} weight="bold" boxSize="0.6em" />
				</AvatarBadge>
			)}
		</Avatar>
	)
}
