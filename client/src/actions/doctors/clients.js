import axios from 'axios'

import { 
  GET_DOCTOR,
  GET_DOCTORS,
  RES_DATA,
  RES_ERRORS,
} from '../constants'

import { url } from '../../config/url'

export const createClient = (data) => async dispatch => {
  try{
    const response = await axios.post(url + `/clients`, data)
    response.status.toString()[0] === '2' ? dispatch({type: RES_DATA}) : dispatch({type: RES_ERRORS, payload: response})
  } catch(e){
    console.log('ERR', e)
  }
}

