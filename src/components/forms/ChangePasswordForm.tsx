import { Alert, AlertIcon, Container, LayoutProps, SpaceProps } from '@chakra-ui/react'
import { User } from '../../models/User'
import { FormValue } from '../../models/form/FormValue'
import { TextInput } from './controls/TextInput'

interface ChangePasswordFormProps extends SpaceProps, LayoutProps {
	user: User
	passwordConsumer: (value: FormValue<string>) => void
	repeatPasswordConsumer: (value: FormValue<string>) => void
	repeatValidator: (input: string | undefined) => boolean
}

export const ChangePasswordForm = ({
	user,
	passwordConsumer,
	repeatPasswordConsumer,
	repeatValidator,
}: ChangePasswordFormProps) => {
	return (
		<Container>
			{!user.passwordHash && (
				<Alert status="warning">
					<AlertIcon />
					You don't have any password set, only temporary tokens. It is highly recommended that you set a
					password now.
				</Alert>
			)}
			<TextInput
				label="New password"
				placeholder="Insert the new password"
				isPassword={true}
				validator={input => !!input && input.length > 6}
				valueConsumer={passwordConsumer}
				invalidLabel="Your password should contain at least 6 characters."
			/>
			<TextInput
				label="Repeat password"
				placeholder="Insert again the new password"
				isPassword={true}
				validator={repeatValidator}
				valueConsumer={repeatPasswordConsumer}
				invalidLabel="The two passwords do not match."
				marginTop="1em"
			/>
		</Container>
	)
}
