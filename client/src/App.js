import React from 'react'
import { createBrowserHistory } from 'history'

import { Router, Route, Switch, Redirect } from 'react-router-dom'

import Clients from './components/Clients/Clients'
import Doctors from './components/Doctors/Doctors'
import DoctorProfile from './components/Doctors/DoctorProfile'

export const history = createBrowserHistory()

export default function App(){
  
  return (
    <Router history={history}>
      <div style={{display: 'flex', width: '100%', height: '100vh'}}>
        <Routes/>
      </div>
    </Router>
    
  )
}

const Routes = () => {
  return(
    <Switch>
      <Route path='/' component={Doctors}/>
      <Route path='/clients' component={Clients}/>
      <Route path='/doctor/profile/:id' component={DoctorProfile}/>
    </Switch>
  )
}
