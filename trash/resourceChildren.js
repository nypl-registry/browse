import { constants } from '../actions/resources'

export default function resourceChildren (resourceChildrenState = { isFetching: false, items: [] }, action) {
  switch (action.type) {
    case constants.FETCH_RESOURCE_CHILDREN:
      return Object.assign({}, resourceChildrenState, {
        isFetching: true
      })
    case constants.RECEIVE_RESOURCE_CHILDREN:
      return Object.assign({}, resourceChildrenState, {
        isFetching: false,
        items: action.items
      })
    default:
      return resourceChildrenState
  }
}

