import React from 'react'
import {Routes, Route} from 'react-router'

function AuthenticatedApp() {
  return (
    <div className="h-screen w-screen">
      <AppRoutes></AppRoutes>
    </div>
  )
}

function SideNav() {}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/home"
        element={
          <div className="text-center text-xl text-blue-500">Hello World</div>
        }
      ></Route>
    </Routes>
  )
}

export default AuthenticatedApp
