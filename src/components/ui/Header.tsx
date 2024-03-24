import {Avatar, Button, Flex, HStack, Image, Spacer, Text} from "@chakra-ui/react";
import {DarkMode} from "./DarkMode";


export const Header = () =>
{
	const names =
		["Aurora","Bailey","Cabanela","Daru","Esker","Feldspar","Gabbro","Hornfels","Irina",
			"Jowd","Kurisu","Lynne","Miguel","Naem","Okabe","Pasquale","Quasimodo","Riebeck","Solanum","Tullio",
			"Umbra","Vicky","Wallace","Xenia","Yomiel","Zenigata"]
	const numero = Math.floor(Math.random()*names.length)
	const nameSelected = names[numero]

	return <>
		<Flex as={"nav"} p={"10px"} alignItems={"center"}>
			<HStack>
				<Avatar name={nameSelected} />
				<Text>{nameSelected}</Text>
			</HStack>

			<Spacer />
			<DarkMode />
			{ /* <Spacer /> */ }

		</Flex>
	</>
}

export default Header