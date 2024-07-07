import { Flex, Spacer } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { resetPageTitle } from '../../store/ui/ui-slice'
import { useEffect } from 'react'
import { MainMenuItem } from '../../components/ui/MainMenuItem'
import { useIsMobileLayout } from '../../hooks/responsive-size'
import { jwtSelector } from '../../store/auth/auth-slice'
import { useGetPermissionsQuery } from '../../services/user'
import { PERMISSIONS } from '../../models/security/Permissions'

export const HomePage = () => {
	const isMobile = useIsMobileLayout()
	const dispatch = useAppDispatch()
	const jwt = useAppSelector(jwtSelector)
	const { data: permissions } = useGetPermissionsQuery(undefined, { skip: !jwt })

	useEffect(() => {
		dispatch(resetPageTitle())
	}, [dispatch])

	const menuItemWidth = isMobile ? '100%' : '31vw'

	return (
		<Flex width="full" justifyContent="center" alignItems="top" direction="column" padding="0px" margin="0px">
			<Flex
				width="full"
				justifyContent="center"
				alignItems="top"
				gap={4}
				direction={isMobile ? 'column' : 'row'}
				pl={isMobile ? '1em' : undefined}
				pr={isMobile ? '1em' : undefined}
			>
				<MainMenuItem
					title="Storage"
					elements={{ 'Browse rooms': '/storage' }}
					showLastDivider={true}
					width={menuItemWidth}
				/>
				<MainMenuItem
					title="Material"
					elements={{
						'Add a new Material': '/material',
						'Search Materials': '/material/search',
					}}
					showLastDivider={false}
					width={menuItemWidth}
				/>
				<MainMenuItem
					title="Box"
					elements={{
						'Add a new Box': '/box',
						'Search Boxes': '/box/search',
					}}
					width={menuItemWidth}
					showLastDivider={false}
				/>
			</Flex>
			<Flex
				width="full"
				justifyContent="center"
				alignItems="top"
				gap={4}
				direction={isMobile ? 'column' : 'row'}
				pl={isMobile ? '1em' : undefined}
				pr={isMobile ? '1em' : undefined}
				mt={'1em'}
			>
				{!!permissions &&
					(permissions.includes(PERMISSIONS.ADMIN) ||
						permissions.includes(PERMISSIONS.MANAGE_NOTIFICATIONS)) && (
						<MainMenuItem
							title="Alerts"
							elements={{
								'Add a new Alert': '/alert',
							}}
							width={menuItemWidth}
							showLastDivider={false}
						/>
					)}
			</Flex>
		</Flex>
	)
}
