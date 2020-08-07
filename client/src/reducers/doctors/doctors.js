import { GET_DOCTORS } from '../../actions/constants'

const initialState = {
  items: [],
  isFetching: false,
}

function doctors(state = initialState, action){
  switch(action.type){
    case GET_DOCTORS:
      return Object.assign({}, state, {
        items: action.payload.data.data,
        isFetching: true,
      })
    default: 
      return state
  }
}

export default doctors