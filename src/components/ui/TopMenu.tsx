import {Avatar, Button, Flex, HStack, Image, Spacer, Text} from "@chakra-ui/react";
import {DarkMode} from "./DarkMode";
import {resetToken} from "../../store/auth/auth-thunk";
import {useAppDispatch} from "../../hooks/redux";


export const TopMenu = () =>
{
	const names =
		["Aurora","Bailey","Cabanela","Daru","Esker","Feldspar","Gabbro","Hornfels","Irina",
			"Jowd","Kurisu","Lynne","Miguel","Naem","Okabe","Pasquale","Quasimodo","Riebeck","Solanum","Tullio",
			"Umbra","Vicky","Wallace","Xenia","Yomiel","Zenigata"]
	const numero = Math.floor(Math.random()*names.length)
	const nameSelected = names[numero]
	const dispatch = useAppDispatch()

	function logout()
	{
		dispatch(resetToken())
	}

	return <>
		<Flex as={"nav"} p={"10px"} alignItems={"center"}>
			<HStack>
				<Avatar name={nameSelected} />
				<Text>{nameSelected}</Text>
			</HStack>
			<Spacer />
			<DarkMode />
			<Spacer />
			<Button colorScheme={"orange"} onClick={logout}
				>Logout
				<Image src={"https://img.icons8.com/sf-regular/48/exit.png"} width={"30px"}/>
			</Button>

		</Flex>
	</>
}

export default TopMenu