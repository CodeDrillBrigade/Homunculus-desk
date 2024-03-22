import {FormControl, HStack, Input, Spacer} from "@chakra-ui/react";
import {useState} from "react";
import {Search2Icon} from "@chakra-ui/icons";

export const Search = () =>
{
	const [text, setText] = useState("")

	function submit()
	{
		// todo: fare qualcosa con il text
	}

	function onChange(t:string)
	{
		setText(t)
	}

	return <>

		<HStack p={5}> {/*Come cazzo si fa a mettere una percentuale del box contenitore, porco CSS*/}
			<FormControl>
				<Input placeholder={"Search something..."} type='text' onChange={ event => {onChange(event.target.value)}}/>
				{/* <Input type={"submit"} onSubmit={event => {submit(text)}} /> */}
			</FormControl>
			<Spacer />
			<Search2Icon onClick={() => {submit()}} />
		</HStack>

	</>
}

export default Search