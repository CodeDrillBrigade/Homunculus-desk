import { Center } from "@chakra-ui/react";
import {useLocation} from "react-router-dom";

export const Immaterial = () =>
{
	const current = useLocation().pathname
	console.log(current)

	return<>
	<Center>
		<h1 style={{color:"red"}}> GUARDAMI: SONO IL COMPONENTE IMMATERIAL</h1>
	</Center>
	</>
}

export default Immaterial