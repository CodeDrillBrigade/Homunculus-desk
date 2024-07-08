import { Button, HStack, Icon } from '@chakra-ui/react'
import { DotsThree, CaretLeft, CaretRight } from '@phosphor-icons/react'

interface PageControlsProps {
	hasNext: boolean
	currentPage: number
	increasePage: () => void
	decreasePage: () => void
	onNextEnter?: () => void
}

export const PageControls = ({ hasNext, currentPage, increasePage, decreasePage, onNextEnter }: PageControlsProps) => {
	const nextPage = () => {
		increasePage()
	}

	const previousPage = () => {
		decreasePage()
	}

	return (
		<>
			{(hasNext || currentPage > 1) && (
				<HStack>
					{currentPage > 1 && (
						<Button onClick={previousPage}>
							<Icon as={CaretLeft} weight="bold" />
						</Button>
					)}
					{currentPage >= 3 && (
						<Button isDisabled={true} _hover={{ cursor: 'default' }}>
							<Icon as={DotsThree} weight="bold" />
						</Button>
					)}
					{currentPage >= 2 && <Button onClick={previousPage}>{currentPage - 1}</Button>}
					<Button colorScheme="teal">{currentPage}</Button>
					{hasNext && (
						<Button onClick={nextPage} onMouseEnter={onNextEnter}>
							{currentPage + 1}
						</Button>
					)}
					{hasNext && (
						<Button isDisabled={true} _hover={{ cursor: 'default' }}>
							<Icon as={DotsThree} weight="bold" />
						</Button>
					)}
					{hasNext && (
						<Button onClick={nextPage} onMouseEnter={onNextEnter}>
							<Icon as={CaretRight} weight="bold" />
						</Button>
					)}
				</HStack>
			)}
		</>
	)
}
