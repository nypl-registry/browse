import { constants } from '../actions/apiQueries'

function apiQueryReducer (state, action) {
  var key = null
  var queries = null
  switch (action.type) {
    case constants.FETCH_API:
      key = [action.path, action.params]
      queries = Object.assign({}, state.queries)
      queries[key] = { isFetching: true }
      return Object.assign({}, state, { queries: queries })
    case constants.RECEIVE_API:
      key = [action.path, action.params]
      queries = Object.assign({}, state.queries)
      queries[key] = { isFetching: false, response: action.response }
      return Object.assign({}, state, { queries: queries })
    default:
      return state
  }
}

export default function apiQueries (state = { queries: [], cachedResources: {} }, action) {
  switch (action.type) {
    case constants.FETCH_API:
    case constants.RECEIVE_API:
      return Object.assign({}, state, apiQueryReducer(state, action))

    default:
      return state
  }
}
