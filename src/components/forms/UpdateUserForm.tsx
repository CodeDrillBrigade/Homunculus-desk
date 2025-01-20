import { Flex, FormControl, FormErrorMessage, Input, VStack } from '@chakra-ui/react'
import { User } from '../../models/User'
import { UserAvatar } from '../ui/UserAvatar'
import { useCreateProfilePictureMutation, useModifyProfilePictureMutation } from '../../services/profilePicture'
import React, { useCallback, useState } from 'react'
import { useModifyUserMutation } from '../../services/user'
import { ErrorAlert } from '../errors/ErrorAlert'
import { RegisterUserForm } from './RegisterUserForm'
import { useIsMobileLayout } from '../../hooks/responsive-size'

interface UpdateUserFormProps {
	user: User
}

export const UpdateUserForm = ({ user }: UpdateUserFormProps) => {
	const isMobile = useIsMobileLayout()
	const [tokenIsValid, setTokenIsValid] = useState<boolean>(true)

	const [uploadPicture, { error: uploadPictureError }] = useCreateProfilePictureMutation()
	const [modifyPicture, { error: modifyPictureError }] = useModifyProfilePictureMutation()
	const [modifyUser] = useModifyUserMutation()

	const typeIsValid = (type: string) => {
		return type === 'image/png' || type === 'image/jpeg' || type === 'image/webp'
	}

	const handleFileChange = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const selectedFile = !!event.target.files ? event.target.files[0] : undefined
			if (!selectedFile || selectedFile.size > 1024 * 1024 || !typeIsValid(selectedFile.type)) {
				setTokenIsValid(false)
			} else if (!!user.profilePicture) {
				setTokenIsValid(true)
				modifyPicture({ picture: selectedFile, attachmentId: user.profilePicture })
			} else {
				try {
					const pictureId = await uploadPicture(selectedFile).unwrap()
					setTokenIsValid(true)
					modifyUser({
						...user,
						profilePicture: pictureId,
					})
				} catch (error) {
					setTokenIsValid(false)
				}
			}
		},
		[modifyPicture, modifyUser, uploadPicture, user]
	)

	return (
		<Flex justifyContent="center" direction={isMobile ? 'column' : 'row'}>
			<VStack mr="2em" ml="2em">
				{!!uploadPictureError && (
					<ErrorAlert
						info={{ label: 'An error occurred while uploading the picture', reason: uploadPictureError }}
					/>
				)}
				{!!modifyPictureError && (
					<ErrorAlert
						info={{ label: 'An error occurred while modifying the picture', reason: modifyPictureError }}
					/>
				)}
				<UserAvatar user={user} showWarning={false} size="xl" />
				<FormControl isInvalid={!tokenIsValid}>
					<Input type="file" accept="image/*" onChange={handleFileChange} p={1} />
					<FormErrorMessage>Only .png, .jpg, and .webp under 1Mb are allowed.</FormErrorMessage>
				</FormControl>
			</VStack>
			<RegisterUserForm
				ml="1em"
				width={isMobile ? '90vw' : '50vw'}
				user={user}
				forceNewUsername={false}
				forceNewPassword={false}
				canChangeEmail={true}
				buttonLabel="Update"
				onUpdateError={() => {}}
				onUpdateSuccess={() => {}}
			/>
		</Flex>
	)
}
