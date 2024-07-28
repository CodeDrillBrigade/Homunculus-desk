import { Flex } from '@chakra-ui/react'
import { useAppDispatch } from '../../hooks/redux'
import { resetPageTitle } from '../../store/ui/ui-slice'
import { useEffect } from 'react'
import { MainMenuItem } from '../../components/ui/MainMenuItem'
import { useIsMobileLayout } from '../../hooks/responsive-size'
import { Permissions } from '../../models/security/Permissions'
import { useHasPermission } from '../../hooks/permissions'

export const HomePage = () => {
	const isMobile = useIsMobileLayout()
	const dispatch = useAppDispatch()
	const hasPermission = useHasPermission()

	useEffect(() => {
		dispatch(resetPageTitle())
	}, [dispatch])

	const menuItemWidth = isMobile ? '100%' : '31vw'

	// @ts-ignore
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
					showLastDivider={hasPermission(Permissions.MANAGE_MATERIALS)}
					width={menuItemWidth}
				/>
				<MainMenuItem
					title="Catalog"
					elements={Object.fromEntries(
						([] as string[][])
							.concat(
								hasPermission(Permissions.MANAGE_MATERIALS) ? [['Add a new Material', '/material']] : []
							)
							.concat([['Search Materials', '/material/search']])
					)}
					showLastDivider={false}
					width={menuItemWidth}
				/>
				<MainMenuItem
					title="Inventory"
					elements={Object.fromEntries(
						([] as string[][])
							.concat(hasPermission(Permissions.MANAGE_MATERIALS) ? [['Add a new Box', '/box']] : [])
							.concat([['Search Boxes', '/box/search']])
					)}
					showLastDivider={false}
					width={menuItemWidth}
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
				{hasPermission(Permissions.MANAGE_NOTIFICATIONS) && (
					<MainMenuItem
						title="Alerts"
						elements={{
							'Add a new Alert': '/alert',
							'Search alerts': '/alert/search',
						}}
						width={menuItemWidth}
						showLastDivider={false}
					/>
				)}
				{hasPermission(Permissions.MANAGE_NOTIFICATIONS) && (
					<MainMenuItem
						title="Reports"
						elements={{
							'Add a new Report': '/report',
							'Search reports': '/report/search',
						}}
						width={menuItemWidth}
						showLastDivider={false}
					/>
				)}
				{hasPermission(Permissions.MANAGE_METADATA) && (
					<MainMenuItem
						title="Lab Management"
						elements={Object.fromEntries(
							([] as string[][])
								.concat(hasPermission(Permissions.MANAGE_METADATA) ? [['Manage Tags', '/tag']] : [])
								.concat(hasPermission(Permissions.ADMIN) ? [['Manage Users', '/user/search']] : [])
						)}
						width={menuItemWidth}
						showLastDivider={false}
					/>
				)}
			</Flex>
		</Flex>
	)
}
