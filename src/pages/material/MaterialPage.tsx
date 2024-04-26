import {
	Card,
	CardBody, CardFooter,
	CardHeader,
	Center, Flex,
	Grid,
	GridItem,
	Heading,
	Text,
	useColorModeValue,
	VStack
} from "@chakra-ui/react";
import {AddMaterialForm} from "../../components/materials/AddMaterialForm";
import {useGetMaterialsQuery} from "../../services/material";
import {QueryStatus} from "@reduxjs/toolkit/query";
import {generateSkeletons} from "../../components/ui/StackedSkeleton";
import {ErrorAlert} from "../../components/errors/ErrorAlert";
import {borderDark, borderLight} from "../../styles/theme";
import {ElementTag} from "../../components/models/ElementTag";

export const MaterialPage = () => {
	return (<>
		<Center>
			<Heading marginBottom="1em">Manage Materials</Heading>
		</Center>
		<Grid templateColumns='repeat(4, 1fr)' templateRows='repeat(1`, 1fr)' height="95%" gap={4}>
			<GridItem colSpan={1} paddingLeft="1em"><ListMaterials /></GridItem>
			<GridItem colSpan={3} paddingRight="1em"><AddMaterialForm /></GridItem>
		</Grid>
	</>)
}

const ListMaterials = () => {
	const borderColor = useColorModeValue(borderLight, borderDark)
	const {data, error, status} = useGetMaterialsQuery()
	return <Card backgroundColor="transparent" borderWidth="3px" borderColor={borderColor}>
		<CardBody>
			<VStack>
				{status === QueryStatus.pending && generateSkeletons({quantity: 5, height: "3em"})}
				{!!error && <ErrorAlert info={{label: "Cannot load materials", reason: error}} />}
				{!!data && data.map(it =>
					<Card key={it._id} boxShadow="none" width="100%">
						<CardHeader>
							<Heading size="sm">{it.name}</Heading>
						</CardHeader>
						{!!it.description && <CardBody paddingTop="0px"><Text>{it.description}</Text></CardBody>}
						{!!it.tags && it.tags.length > 0 && <CardFooter paddingTop="0px">
							<Flex>
								{it.tags.map(id =>
									<ElementTag key={id} tagId={id} marginRight="0.4em" compact={!!it.tags && it.tags.length >= 5}/>)
								}
							</Flex>
						</CardFooter>}
					</Card>
				)}
			</VStack>
		</CardBody>
	</Card>
}