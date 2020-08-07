import {
  RES_DATA,
  RES_ERRORS,
  CLEAR_RESPONSE,
} from '../../actions/constants'

const initialState = {
  status: '',
  errors: {},
}

function response(state = initialState, action){
  switch(action.type){
    case RES_DATA:
      return Object.assign({}, state, {
        ...state,
        status: 'ok'
      })
    case RES_ERRORS:
      return {
        status: 'errors',
        errors: action.payload,
      }
    case CLEAR_RESPONSE:
      return initialState
    default:
      return state
  }
}

export default response