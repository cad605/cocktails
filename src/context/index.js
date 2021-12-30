import * as React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {ClientProvider} from './api-client'
import {AuthProvider} from './auth-context'

function AppProviders({children}) {
  return (
    <Router>
      <ClientProvider>
        <AuthProvider>{children}</AuthProvider>
      </ClientProvider>
    </Router>
  )
}

export {AppProviders}
