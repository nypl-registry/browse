import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

// import counter from './counter'
// import history from './history'

import { SET_RESOURCES_QUERY, RECEIVE_RESOURCES, FETCH_RESOURCE, RECEIVE_RESOURCE, FETCH_RESOURCES_AGGREGATIONS, RECEIVE_RESOURCES_AGGREGATIONS, FETCH_RANDOM_RESOURCES, RECEIVE_RANDOM_RESOURCES } from '../actions/index.js'

/*
 *  Browse state:
 *
 *  {
 *    resources: {
 *      isFetching: false,
 *      query: {
 *        value: ...,
 *        filters: ...,
 *        page: ...
 *      },
 *      items: [...],
 *      aggregationsQuery: {...},
 *      aggregations: {
 *        ...
 *      }
 *    },
 *    agents: {
 *      ...
 *    },
 *    resource : {
 *      uri: ...,
 *      title: ...
 *    },
 *    randomResources : {
 *      items: [...],
 *      isFetching: false
 *    }
 *  }
 *
 */

function resourcesQueryReducer (resourcesState, action) {
  // console.log('resources reduce: ', resourcesState)
  switch (action.type) {
    case SET_RESOURCES_QUERY:
      return Object.assign({}, resourcesState, {
        isFetching: true,
        query: action.query
      })
    case RECEIVE_RESOURCES:
      return Object.assign({}, resourcesState, {
        isFetching: false,
        items: action.items,
        total: action.total
      })
    default:
      return resourcesState
  }
}

function resourcesAggregatesQueryReducer (resourcesState, action) {
  // console.log('resources reduce: ', resourcesState)
  switch (action.type) {
    case FETCH_RESOURCES_AGGREGATIONS:
      return Object.assign({}, resourcesState, {
        isFetchingAggregations: true,
        aggregationsQuery: action.aggregationsQuery
      })
    case RECEIVE_RESOURCES_AGGREGATIONS:
      return Object.assign({}, resourcesState, {
        isFetchingAggregations: false,
        aggregations: action.aggregations
      })
    default:
      return resourcesState
  }
}

function resources (state = { query: {}, isFetching: false, isFetchingAggregations: false, items: [], aggregationsQuery: {}, aggregations: [] }, action) {
  switch (action.type) {
    case SET_RESOURCES_QUERY:
    case RECEIVE_RESOURCES:
      return Object.assign({}, state, resourcesQueryReducer(state, action))

    case FETCH_RESOURCES_AGGREGATIONS:
    case RECEIVE_RESOURCES_AGGREGATIONS:
      return Object.assign({}, state, resourcesAggregatesQueryReducer(state, action))

    default:
      return state
  }
}

function randomResourcesQueryReducer (resourcesState, action) {
  switch (action.type) {
    case FETCH_RANDOM_RESOURCES:
      return Object.assign({}, resourcesState, {
        isFetching: true
      })
    case RECEIVE_RANDOM_RESOURCES:
      return Object.assign({}, resourcesState, {
        isFetching: false,
        items: action.items
      })
    default:
      return resourcesState
  }
}

function randomResources (state = { isFetching: false, items: [] }, action) {
  switch (action.type) {
    case FETCH_RANDOM_RESOURCES:
    case RECEIVE_RANDOM_RESOURCES:
      return Object.assign({}, state, randomResourcesQueryReducer(state, action))

    default:
      return state
  }
}

function resourceReducer (resourceState, action) {
  switch (action.type) {
    case FETCH_RESOURCE:
      return Object.assign({}, resourceState, {
        isFetching: true,
        uri: action.uri
      })
    case RECEIVE_RESOURCE:
      return Object.assign({}, resourceState, {
        isFetching: false,
        item: action.item
      })
    default:
      return resourceState
  }
}

function resource (state = { uri: null, isFetching: false, item: null }, action) {
  switch (action.type) {
    case FETCH_RESOURCE:
    case RECEIVE_RESOURCE:
      return Object.assign({}, state, resourceReducer(state, action))

    default:
      return state
  }
}

const rootReducer = combineReducers({
  resources,
  resource,
  randomResources,
  routing: routerReducer
})

export default rootReducer
