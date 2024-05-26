import { Center, Container, Divider, Heading, LayoutProps, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

interface MainMenuItemProps extends LayoutProps {
	title: string
	elements: { [key: string]: string | null }
	showLastDivider: boolean
}

export const MainMenuItem = ({ title, elements, showLastDivider, ...style }: MainMenuItemProps) => {
	return (
		<VStack borderWidth="0.2em" borderRadius="md" borderColor="blue.400" alignItems="center" pb="0.5em" {...style}>
			<Container alignItems="center" w="100%" backgroundColor="blue.400" padding="0.4em">
				<Center>
					<Heading size="md">{title}</Heading>
				</Center>
			</Container>
			{Object.entries(elements).map(([name, link], idx) => (
				<>
					<Container key={`menu-${title}-${idx}`}>
						<Center>
							{!!link && <Link to={link}>{name}</Link>}
							{!link && <Text>{name}</Text>}
						</Center>
					</Container>
					{(idx < Object.keys(elements).length - 1 ||
						(idx === Object.keys(elements).length - 1 && showLastDivider)) && (
						<Divider key={`divider-${title}-${idx}`} />
					)}
				</>
			))}
		</VStack>
	)
}
