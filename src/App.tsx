import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {HomePage} from "./pages/Home/HomePage";
import {LoginPage} from "./pages/LoginPage";
import {Storage} from "./pages/Storage";
import {Search} from "./pages/Search";
import {AuthenticatedLayout} from "./pages/layout/AuthenticatedLayout";
import Material from "./pages/Material";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthenticatedLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { index: true, element: <HomePage /> },
      { path: "/material", element: <Material /> },
      { index: true, element: <HomePage /> },
      { path: "/storage", element: <Storage /> },
      { index: true, element: <HomePage /> },
      { path: "/search", element: <Search /> },

    ]
  }
])

function App() {
  return <RouterProvider router={router} />;
}

export default App;
