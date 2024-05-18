import { Center, Grid, GridItem } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import './home.css'
import Search from '../Search'
import { useAppDispatch } from '../../hooks/redux'
import { resetPageTitle } from '../../store/ui/ui-slice'
import { useEffect } from 'react'

export const HomePage = () => {
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(resetPageTitle())
	}, [dispatch])

	const navigate = useNavigate()
	const goto = (page: string) => navigate(`/${page}`)

	const pages = ['material', 'storage', 'box']
	const h = 20
	const w = '100%'
	const br = 'lg'
	return (
		<>
			<Grid templateColumns="repeat(3, 2fr)" gap={6} p={2}>
				{pages.map(page => (
					<GridItem
						key={page}
						ml={2}
						w={w}
						h={h}
						bg="blue.500"
						onClick={() => {
							goto(page)
						}}
						borderRadius={br}
					>
						<Center h={h}>
							<p>{page.substring(0, 1).toUpperCase().concat(page.substring(1))}</p>
						</Center>
					</GridItem>
				))}

				<GridItem mr={2} w={w} h={h} bg="blue.500" borderRadius={br}>
					<Center h={h}>
						<Search />
					</Center>
				</GridItem>
			</Grid>
		</>
	)
}
