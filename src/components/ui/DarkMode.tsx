
import {Center, HStack, Switch} from "@chakra-ui/react";
import {SunIcon, MoonIcon} from "@chakra-ui/icons"

export const DarkMode = () =>
{
	return <>
		<Center>
			<HStack>
				<SunIcon></SunIcon>
				<Switch size="lg">Allow spying and stealing all your data (and hopefully money)</Switch>
				<MoonIcon></MoonIcon>
			</HStack>
		</Center>
	</>
}