import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../hooks/redux'
import { useEffect } from 'react'
import { jwtSelector } from '../../store/auth/auth-slice'
import TopMenu from '../../components/ui/TopMenu'

export const AuthenticatedLayout = () => {
	const jwt = useAppSelector(jwtSelector)
	const navigate = useNavigate()
	const { pathname } = useLocation()

	useEffect(() => {
		if (!jwt && pathname !== 'login') {
			navigate('/login')
		}
	}, [jwt, navigate, pathname])
	return (
		<>
			<TopMenu />
			<Outlet />
		</>
	)
}
