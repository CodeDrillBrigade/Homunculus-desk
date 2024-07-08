import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HomePage } from './pages/home/HomePage'
import { LoginPage } from './pages/LoginPage'
import { ManageStoragePage } from './pages/storage/ManageStoragePage'
import { AuthenticatedLayout } from './pages/layout/AuthenticatedLayout'
import { MaterialPage } from './pages/material/MaterialPage'
import { BoxPage } from './pages/box/BoxPage'
import { CabinetPage } from './pages/storage/CabinetPage'
import { PasswordResetPage } from './pages/PasswordResetPage'
import { RegisterUserPage } from './pages/RegisterUserPage'
import { SearchMaterialsPage } from './pages/material/SearchMaterialsPage'
import { SearchBoxPage } from './pages/box/SearchBoxPage'
import { AlertPage } from './pages/alert/AlertPage'
import { SearchAlertsPage } from './pages/alert/SearchAlertsPage'

const router = createBrowserRouter([
	{
		path: '/',
		element: <AuthenticatedLayout />,
		children: [
			{ index: true, element: <HomePage /> },
			{
				path: 'box',
				children: [
					{ index: true, element: <BoxPage /> },
					{ path: 'search', element: <SearchBoxPage /> },
				],
			},
			{
				path: 'material',
				children: [
					{ index: true, element: <MaterialPage /> },
					{ path: 'search', element: <SearchMaterialsPage /> },
				],
			},
			{
				path: 'storage',
				children: [
					{ index: true, element: <ManageStoragePage /> },
					{ path: ':roomId/:cabinetId', element: <CabinetPage /> },
				],
			},
			{
				path: 'alert',
				children: [
					{ index: true, element: <AlertPage /> },
					{ path: 'search', element: <SearchAlertsPage /> },
				],
			},
		],
	},
	{ path: 'login', element: <LoginPage /> },
	{ path: 'passwordReset', element: <PasswordResetPage /> },
	{ path: 'register', element: <RegisterUserPage /> },
])

function App() {
	return <RouterProvider router={router} />
}

export default App
