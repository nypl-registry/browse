import { combineReducers } from 'redux'
import counter from './counter'
import history from './history'

const rootReducer = combineReducers({
  counter,history
})

export default rootReducer