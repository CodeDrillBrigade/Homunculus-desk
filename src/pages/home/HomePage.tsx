import { Flex } from '@chakra-ui/react'
import { useAppDispatch } from '../../hooks/redux'
import { resetPageTitle } from '../../store/ui/ui-slice'
import { useEffect } from 'react'
import { MainMenuItem } from '../../components/ui/MainMenuItem'
import { useIsMobileLayout } from '../../hooks/responsive-size'

export const HomePage = () => {
	const isMobile = useIsMobileLayout()
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(resetPageTitle())
	}, [dispatch])

	const menuItemWidth = isMobile ? '90vw' : '31vw'

	return (
		<Flex width="100%" justifyContent="center" alignItems="top" gap={4} direction={isMobile ? 'column' : 'row'}>
			<MainMenuItem
				title="Storage"
				elements={{ 'Browse rooms': 'storage' }}
				showLastDivider={true}
				width={menuItemWidth}
			/>
			<MainMenuItem
				title="Material"
				elements={{
					'Add a new Material': 'material',
					Search: null,
				}}
				showLastDivider={false}
				width={menuItemWidth}
			/>
			<MainMenuItem
				title="Box"
				elements={{ 'Add a new Box': 'box' }}
				width={menuItemWidth}
				showLastDivider={true}
			/>
		</Flex>
	)
}
