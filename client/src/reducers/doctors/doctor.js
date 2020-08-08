import { GET_DOCTOR } from '../../actions/constants'

const initialState = {
  items: {},
  isFetching: false,
}

function doctor(state = initialState, action){
  switch(action.type){
    case GET_DOCTOR:
      return Object.assign({}, state, {
        items: action.payload.data.data,
        isFetching: true,
      })
    case 'CLEAR_DOCTOR':
      return initialState
    default: 
      return state
  }
}

export default doctor