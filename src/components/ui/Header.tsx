import {Avatar, Button, Flex, HStack, Image, Spacer, Text} from "@chakra-ui/react";
import {DarkMode} from "./DarkMode";
import {jwtSelector} from "../../store/auth/auth-slice";
import {localStorageJwtKey} from "../../store/auth/auth-thunk";


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
			<Spacer />
			<Button colorScheme={"orange"}>Logout <Image src={"https://img.icons8.com/sf-regular/48/exit.png"} width={"30px"}/></Button>

		</Flex>
	</>
}

export default Header