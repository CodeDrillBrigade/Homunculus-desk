import { Alert, AlertIcon, Container, LayoutProps, SpaceProps } from '@chakra-ui/react'
import { User } from '../../models/User'
import { FormValue } from '../../models/form/FormValue'
import { TextInput } from './controls/TextInput'
import { useFormControl } from '../../hooks/form-control'

interface ChangePasswordFormProps extends SpaceProps, LayoutProps {
	user: User
	passwordConsumer: (value: FormValue<string>) => void
	repeatPasswordConsumer: (value: FormValue<string>) => void
	repeatValidator: (input: string | undefined) => boolean
	showTokenWarning?: boolean
	canBeNull: boolean
}

export const ChangePasswordForm = ({
	user,
	passwordConsumer,
	repeatPasswordConsumer,
	repeatValidator,
	showTokenWarning,
	canBeNull,
	...style
}: ChangePasswordFormProps) => {
	const repeatControls = useFormControl<string>({
		validator: repeatValidator,
		valueConsumer: repeatPasswordConsumer,
	})

	return (
		<Container {...style}>
			{!user.passwordHash && (showTokenWarning ?? true) && (
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
				validator={input => (canBeNull && !input) || (!!input && input.length >= 6)}
				valueConsumer={data => {
					repeatControls.resetValue(!data.value || data.value === '')
					passwordConsumer(data)
				}}
				invalidLabel="Your password should contain at least 6 characters."
			/>
			<TextInput
				label="Repeat password"
				placeholder="Insert again the new password"
				isPassword={true}
				controls={repeatControls}
				invalidLabel="The two passwords do not match."
				marginTop="1em"
			/>
		</Container>
	)
}
