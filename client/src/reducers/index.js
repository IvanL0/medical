import { combineReducers } from 'redux'

import clients from './clients/clients'
import doctors from './doctors/doctors'
import response from './response/response'

export const appReducer = combineReducers({
  clients,
  doctors,
  response,
})