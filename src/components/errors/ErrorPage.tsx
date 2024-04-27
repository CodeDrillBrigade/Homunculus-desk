import { Heading, Text, VStack } from '@chakra-ui/react'
import { ErrorAlert } from './ErrorAlert'

interface ErrorPageProps {
	title?: string
	description?: string
	error?: any
}

export const ErrorPage = ({ title, description, error }: ErrorPageProps) => {
	return (
		<VStack>
			<Heading>{title ?? 'Ooops!'}</Heading>
			<Text fontSize="lg">{description ?? 'An error occurred'}</Text>
			{!!error && <ErrorAlert info={{ label: 'Caused by', reason: error }} />}
		</VStack>
	)
}
