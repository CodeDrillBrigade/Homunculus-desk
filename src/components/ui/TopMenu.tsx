import {Avatar, Box, Button, Flex, HStack, Image, SkeletonCircle, Spacer, Text} from "@chakra-ui/react";
import {DarkMode} from "./DarkMode";
import {resetToken} from "../../store/auth/auth-thunk";
import {useAppDispatch} from "../../hooks/redux";
import {useGetCurrentUserQuery, useGetPermissionsQuery} from "../../services/user";
import {Back} from "./Back";

export const TopMenu = () =>
{
	const { data, error, status} = useGetCurrentUserQuery()
	const { data:permissions } = useGetPermissionsQuery()
	const dispatch = useAppDispatch()
	const prefix = ["Hello, ", "Hi, ", "Welcome, ", ""][Math.floor(Math.random() * 4)]
	const suffix = "!"

	function logout()
	{
		dispatch(resetToken())
	}

	return <>
		<Flex as={"nav"} p={"10px"} alignItems={"center"}>
			<Box marginRight={5}>
				<Back />
			</Box>
			<HStack >
				{ /*
					Nota: Attualmente questo HStack cambia lunghezza quando cambia il nome dell'utente loggato,
					 facendo spostare a destra il pulsante DarkMode. Il risultato fa schifo e maxWidth non
					 sembra avere effetto.
				*/ }
				{ !!data && !!permissions && <Avatar name={data.name} /> }
				{ !! data && <Text>{`${prefix}${data.name}${prefix==="" ? "" : suffix}`}</Text> }

				{ !data && <SkeletonCircle /> }
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