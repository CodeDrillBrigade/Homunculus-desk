import { useAppDispatch } from '../../hooks/redux'
import React, { useEffect, useState } from 'react'
import { setPageTitle } from '../../store/ui/ui-slice'
import { useIsMobileLayout } from '../../hooks/responsive-size'
import { Alert, AlertIcon, Center, VStack } from '@chakra-ui/react'
import { MaterialSelector } from '../../components/forms/controls/MaterialSelector'
import { Material } from '../../models/Material'
import { useGetBoxWithMaterialQuery } from '../../services/box'
import { ErrorAlert } from '../../components/errors/ErrorAlert'
import { StackedSkeleton } from '../../components/ui/StackedSkeleton'
import { ElementBox } from '../../components/models/ElementBox'

export const SearchBoxPage = () => {
	const isMobile = useIsMobileLayout()
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(setPageTitle('Search Boxes by Material'))
	}, [dispatch])

	const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
	const {
		data: boxes,
		error: boxesError,
		isLoading: boxesLoading,
	} = useGetBoxWithMaterialQuery(selectedMaterial?._id ?? '', { skip: !selectedMaterial })

	const sideMargin = isMobile ? '0.5em' : '2em'

	return (
		<VStack alignItems="left" ml={sideMargin} mr={sideMargin}>
			<MaterialSelector
				placeholder="Start typing to search a Material"
				valueConsumer={value => {
					if (value.isValid && !!value.value) {
						setSelectedMaterial(value.value)
					}
				}}
			/>
			{!boxesError && !selectedMaterial && (
				<Center>
					<Alert status="info" w="50%">
						<AlertIcon />
						Choose a material to query the boxes.
					</Alert>
				</Center>
			)}
			{!boxesError && !!boxes && boxes.length === 0 && (
				<Center>
					<Alert status="warning" w="50%">
						<AlertIcon />
						There are no boxes for this material.
					</Alert>
				</Center>
			)}
			{!!boxesError && (
				<ErrorAlert
					info={{ label: 'An error occurred while retrieving the materials', reason: boxesError }}
					w="50%"
				/>
			)}
			{boxesLoading && <StackedSkeleton quantity={5} height="3em" />}
			{!!boxes && boxes.map(box => <ElementBox key={box._id} box={box} width="100%" />)}
		</VStack>
	)
}
