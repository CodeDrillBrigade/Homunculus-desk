import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HomePage } from './pages/Home/HomePage'
import { LoginPage } from './pages/LoginPage'
import { ManageStoragePage } from './pages/storage/ManageStoragePage'
import { AuthenticatedLayout } from './pages/layout/AuthenticatedLayout'
import { MaterialPage } from './pages/material/MaterialPage'
import { BoxPage } from './pages/box/BoxPage'
import { CabinetPage } from './pages/storage/CabinetPage'

const router = createBrowserRouter([
	{
		path: '/',
		element: <AuthenticatedLayout />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: 'box', element: <BoxPage /> },
			{ path: 'material', element: <MaterialPage /> },
			{
				path: 'storage',
				children: [
					{ index: true, element: <ManageStoragePage /> },
					{ path: ':roomId/:cabinetId', element: <CabinetPage /> },
				],
			},
		],
	},
	{ path: 'login', element: <LoginPage /> },
])

function App() {
	return <RouterProvider router={router} />
}

export default App
