import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {HomePage} from "./pages/Home/HomePage";
import {LoginPage} from "./pages/LoginPage";
import {ManageStoragePage} from "./pages/storage/ManageStoragePage";
import {AuthenticatedLayout} from "./pages/layout/AuthenticatedLayout";
import Material from "./pages/Material";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthenticatedLayout/>,
    children: [
      { index: true, element: <HomePage/> },
      { path: "material", element: <Material/> },
      { path: "storage", element: <ManageStoragePage/> },
    ]
  }
  ,
  { path: "login", element: <LoginPage/> },
])

function App() {
  return <RouterProvider router={router} />;
}

export default App;
