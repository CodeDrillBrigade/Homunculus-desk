import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, Icon } from '@chakra-ui/react'
import React from 'react'
import { Plus } from '@phosphor-icons/react'

export const NoBoxesWarning = ({ onClick }: { onClick: () => void }) => {
	return (
		<Alert status="warning" flexDirection="column">
			<AlertIcon />
			<AlertTitle>There are no boxes on this shelf</AlertTitle>
			<AlertDescription mt="1em">
				<Button colorScheme="green" leftIcon={<Icon as={Plus} weight="bold" boxSize={5} />} onClick={onClick}>
					Add a Box
				</Button>
			</AlertDescription>
		</Alert>
	)
}
