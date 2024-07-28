import { Avatar, Box, Flex, Text } from '@chakra-ui/react'
import { generateSkeletonAvatars } from '../ui/StackedSkeleton'
import { ErrorAlert } from '../errors/ErrorAlert'
import React from 'react'
import { useIsMobileLayout } from '../../hooks/responsive-size'
import { useGetUsersByIdsQuery } from '../../services/user'
import { UserAvatar } from '../ui/UserAvatar'

export const RecipientsList = ({ recipients }: { recipients: string[] }) => {
	const isMobile = useIsMobileLayout()
	const { data: users, isLoading: usersLoading, error: usersError } = useGetUsersByIdsQuery(recipients)

	return (
		<Box mt="0.5em">
			<Text fontSize="lg" as="b">
				Recipients
			</Text>
			<Flex mt="0.2em">
				{usersLoading && generateSkeletonAvatars({ quantity: 3, size: '10' })}
				{!!usersError && (
					<ErrorAlert info={{ label: 'There was an error fetching the recipients', reason: usersError }} />
				)}
				{!!users &&
					users.map(user => (
						<Flex key={user._id}>
							<UserAvatar user={user} showWarning={false} boxSize={10} />
							{!isMobile && (
								<Text fontSize="lg" ml="0.6em" mt="0.3em">
									{!!user.name || user.surname
										? `${user.name + ' ' ?? ''}${user.surname ?? ''}`
										: user.username}
								</Text>
							)}
						</Flex>
					))}
			</Flex>
		</Box>
	)
}
