import {
	Button,
	Center,
	Icon,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Text,
} from '@chakra-ui/react'
import { FileArrowDown } from '@phosphor-icons/react'
import { useInitReportCreationMutation } from '../../services/material'
import { getReportDownloadUrl } from '../../utils/url-utils'

interface MaterialReportModalProps {
	onClose: () => void
	isOpen: boolean
}

export const MaterialReportModal = ({ onClose, isOpen }: MaterialReportModalProps) => {
	const [createReport, { isLoading }] = useInitReportCreationMutation()
	const handleDownload = async () => {
		const result = await createReport()
		if ('data' in result) {
			window.open(getReportDownloadUrl(result.data), '_blank')
		}
	}
	return (
		<Modal isOpen={isOpen} onClose={onClose} size="xl">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					<Text>Download a report of the materials</Text>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody pt="1em" pb="2em">
					<Center>
						<Button
							leftIcon={<Icon as={FileArrowDown} boxSize={7} />}
							colorScheme="green"
							variant="solid"
							size="lg"
							onClick={handleDownload}
							loadingText="Preparing report"
							isLoading={isLoading}
						>
							Download Materials Report
						</Button>
					</Center>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}
