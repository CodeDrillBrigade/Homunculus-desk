import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {HomePage} from "./pages/Home/HomePage";
import {LoginPage} from "./pages/LoginPage";
import {AuthenticatedLayout} from "./pages/layout/AuthenticatedLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthenticatedLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/login", element: <LoginPage />}
    ]
  }
])

function App() {
  return <RouterProvider router={router} />;
}

export default App;
