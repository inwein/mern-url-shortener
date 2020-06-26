import React from 'react'
import {BrowserRouter} from 'react-router-dom';
import {useRoutes} from './routes';
import { useAuth } from './hooks/auth.hook';
import {AuthContext} from './context/AuthContext';
import NavBar from './components/NavBar';
import 'materialize-css';
import { Loader } from './components/Loader';

function App () {
  const {login, logout, token, userId, ready} = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated);
   
  if (!ready) {
    return (
      <Loader />
    )
  }

  return (
    <AuthContext.Provider value={{
      token, userId, login, logout, isAuthenticated
    }}>
      <BrowserRouter>
      {isAuthenticated && <NavBar />}
        <div className="container">
            {routes}
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App