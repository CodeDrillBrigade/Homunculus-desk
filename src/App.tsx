import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {HomePage} from "./pages/HomePage";
import {LoginPage} from "./pages/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
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
