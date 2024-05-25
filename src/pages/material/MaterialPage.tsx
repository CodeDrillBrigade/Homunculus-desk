import {
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Center,
	Flex,
	Grid,
	GridItem,
	Heading,
	Text,
	useColorModeValue,
	VStack,
} from '@chakra-ui/react'
import { AddMaterialForm } from '../../components/materials/AddMaterialForm'
import { useGetMaterialsQuery } from '../../services/material'
import { QueryStatus } from '@reduxjs/toolkit/query'
import { generateSkeletons } from '../../components/ui/StackedSkeleton'
import { ErrorAlert } from '../../components/errors/ErrorAlert'
import { borderDark, borderLight } from '../../styles/theme'
import { ElementTag } from '../../components/models/ElementTag'
import { useAppDispatch } from '../../hooks/redux'
import { setPageTitle } from '../../store/ui/ui-slice'
import { useEffect } from 'react'
import { MaterialCard } from '../../components/models/MaterialCard'

export const MaterialPage = () => {
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(setPageTitle('Manage Materials'))
	}, [dispatch])
	return (
		<>
			<Grid templateColumns="repeat(4, 1fr)" templateRows="repeat(1`, 1fr)" height="95%" gap={4}>
				<GridItem colSpan={1} paddingLeft="1em">
					<ListMaterials />
				</GridItem>
				<GridItem colSpan={3} paddingRight="1em">
					<AddMaterialForm />
				</GridItem>
			</Grid>
		</>
	)
}

const ListMaterials = () => {
	const borderColor = useColorModeValue(borderLight, borderDark)
	const { data, error, status } = useGetMaterialsQuery()
	return (
		<Card backgroundColor="transparent" borderWidth="3px" borderColor={borderColor}>
			<CardBody>
				<VStack>
					{status === QueryStatus.pending && generateSkeletons({ quantity: 5, height: '3em' })}
					{!!error && <ErrorAlert info={{ label: 'Cannot load materials', reason: error }} />}
					{!!data && data.map(it => <MaterialCard key={it._id} material={it} />)}
				</VStack>
			</CardBody>
		</Card>
	)
}
