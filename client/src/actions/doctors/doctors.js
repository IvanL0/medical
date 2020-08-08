import axios from 'axios'

import { 
  GET_DOCTOR,
  GET_DOCTORS,
  RES_DATA,
  RES_ERRORS,
} from '../constants'

import { url } from '../../config/url'

export const getDoctors = () => async dispatch => {
  try{
    const response = await axios.get(url + '/doctors', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    dispatch({type: GET_DOCTORS, payload: response})
  } catch(e){
    console.log('ERR', e)
  }
}

export const getDoctor = (id) => async dispatch => {
  try{
    const response = await axios.get(url + `/doctors/${id}`)
    dispatch({type: GET_DOCTOR, payload: response})
  } catch(e){
    console.log('ERR', e)
  }
}

export const postDoctor = (data) => async dispatch => {
  try{
    const response = await axios.post(url + `/doctors`, data)
    response.status.toString()[0] === '2' ? 
      dispatch({type: RES_DATA}) : 
      dispatch({type: RES_ERRORS, payload: response})
  } catch(e){
    console.log('ERR', e)
  }
}

export const updateDoctor = (id, data) => async dispatch => {
  try{
    const response = await axios.patch(url + `/doctors/${id}`, data)
    response.status.toString()[0] === '2' ? dispatch({type: RES_DATA}) : dispatch({type: RES_ERRORS, payload: response})
  } catch(e){
    console.log('ERR', e)
  }
}

