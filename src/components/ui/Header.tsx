import {Avatar, Button, Flex, HStack, Image, Spacer, Text} from "@chakra-ui/react";
import {DarkMode} from "./DarkMode";


export const Header = () =>
{
	const names =
		["Aurora","Bailey","Cabanela","Damiano","Esker","Feldspar","Gabbro","Hornfels","Irina",
			"Jowd","Kurisu","Lynne","Miguel","Naem","Omero","Pasquale","Quasimodo","Riebeck","Solanum","Tullio",
			"Umbra","Vicky","Wallace","Xenia","Yomiel","Zenigata"]
	const numero = Math.floor(Math.random()*names.length)
	const nameSelected = names[numero]

	const logout = () => {

	}

	return <>
		<Flex as={"nav"} p={"10px"} alignItems={"center"}>
			<HStack>
				<Avatar name={nameSelected} />
				<Text>{nameSelected}</Text>
			</HStack>

			<Spacer/>
			<DarkMode />
			<Spacer/>

			<HStack spacing={"20px"}>
				<Spacer />
				<Button colorScheme={"orange"} onClick={logout}>Logout
					<Image src={"https://img.icons8.com/sf-regular/48/exit.png"} width={"30px"}/>
				</Button>
			</HStack>

		</Flex>
	</>
}

export default Header