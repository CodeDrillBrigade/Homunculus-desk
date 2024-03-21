
import {Center, HStack, Switch, useColorMode} from "@chakra-ui/react";
import {SunIcon, MoonIcon} from "@chakra-ui/icons"
import {useEffect} from "react";

export const DarkMode = () =>
{
	const {colorMode, toggleColorMode} = useColorMode()
	useEffect(()=> {
		if (colorMode === "dark")
		{
			document.body.style.backgroundColor = "#282828"
		}else
		{
			document.body.style.backgroundColor = "#ffffff"
		}
	}, [colorMode])


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