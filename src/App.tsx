import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {HomePage} from "./pages/Home/HomePage";
import {LoginPage} from "./pages/LoginPage";
import {ManageStoragePage} from "./pages/storage/ManageStoragePage";
import {AuthenticatedLayout} from "./pages/layout/AuthenticatedLayout";
import {MaterialPage} from "./pages/material/MaterialPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthenticatedLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "material", element: <MaterialPage /> },
      { path: "storage", element: <ManageStoragePage /> },
    ]
  }
])

function App() {
  return <RouterProvider router={router} />;
}

export default App;
