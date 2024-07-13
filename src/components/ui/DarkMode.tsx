import { Center, HStack, Icon, Switch, useColorMode } from '@chakra-ui/react'
import { Moon, Sun } from '@phosphor-icons/react'

export const DarkMode = () => {
	const { colorMode, toggleColorMode } = useColorMode()

	const clickHandler = () => {
		toggleColorMode()
	}

	return (
		<>
			<Center>
				<HStack>
					<Icon as={Sun} boxSize={'6'} color={'orange.200'} />
					<Switch isChecked={colorMode === 'dark'} onChange={clickHandler} size={'lg'} />
					<Icon as={Moon} boxSize={'6'} color={'blue.700'} />
				</HStack>
			</Center>
		</>
	)
}
