import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

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

import resources from './resources'
import agents from './agents'

const rootReducer = combineReducers({
  resources,
  agents,
  routing: routerReducer
})

export default rootReducer
