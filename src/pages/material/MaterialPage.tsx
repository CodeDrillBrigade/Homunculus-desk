import { Card, CardBody, Grid, GridItem, useColorModeValue, VStack } from '@chakra-ui/react'
import { AddMaterialForm } from '../../components/materials/AddMaterialForm'
import { useGetLastCreatedQuery } from '../../services/material'
import { generateSkeletons } from '../../components/ui/StackedSkeleton'
import { ErrorAlert } from '../../components/errors/ErrorAlert'
import { borderDark, borderLight } from '../../styles/theme'
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
	const { data, error, isLoading } = useGetLastCreatedQuery(5)
	return (
		<Card backgroundColor="transparent" borderWidth="3px" borderColor={borderColor}>
			<CardBody>
				<VStack>
					{isLoading && generateSkeletons({ quantity: 5, height: '3em' })}
					{!!error && <ErrorAlert info={{ label: 'Cannot load materials', reason: error }} />}
					{!!data && data.map(it => <MaterialCard key={it._id} material={it} isCompact={true} />)}
				</VStack>
			</CardBody>
		</Card>
	)
}
