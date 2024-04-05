import { useNavigate } from "react-router-dom"
import {Button} from "@chakra-ui/react";

export function Back({prevPage="Homepage"})
{
	const navigate = useNavigate()

	return <>
			<Button onClick={() => navigate(-1)}>{"< "+prevPage}</Button>
		</>
}
