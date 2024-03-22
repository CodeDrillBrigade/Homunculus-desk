
import {Center, HStack, Switch, useColorMode} from "@chakra-ui/react";
import {SunIcon, MoonIcon} from "@chakra-ui/icons"

export const DarkMode = () =>
{
	const {colorMode, toggleColorMode} = useColorMode()

	const click = () => {
		toggleColorMode()
	}

	return <>
		<Center>
			<HStack>
				<SunIcon boxSize={"6"} color={"orange.200"} />
				<Switch isChecked={colorMode === "dark"} onChange={click} size={"lg"} />
				<MoonIcon boxSize={"6"} color={"blue.700"} />
			</HStack>
		</Center>

	</>
}