import { Alert, AlertDescription, AlertIcon, AlertTitle, Button } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import React from 'react'

export const NoBoxesWarning = ({ onClick }: { onClick: () => void }) => {
	return (
		<Alert status="warning" flexDirection="column">
			<AlertIcon />
			<AlertTitle>There are no boxes on this shelf</AlertTitle>
			<AlertDescription mt="1em">
				<Button colorScheme="green" leftIcon={<AddIcon />} onClick={onClick}>
					Add a Box
				</Button>
			</AlertDescription>
		</Alert>
	)
}
