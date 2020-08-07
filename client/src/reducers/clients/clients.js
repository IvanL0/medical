import { GET_CLIENTS } from '../../actions/constants'

const initialState = {
  items: [],
  isFetching: false,
}

function clients(state = initialState, action){
  switch(action.type){
    case GET_CLIENTS:
      return Object.assign({}, state, {
        items: action.payload.data.data,
        isFetching: true,
      })
    default: 
      return state
  }
}

export default clients