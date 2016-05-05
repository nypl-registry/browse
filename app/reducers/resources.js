import { constants, queryId } from '../actions/resources'

// Utils:

function addQuery (_queries, query) {
  var queries = Object.assign({}, _queries)
  queries[queryId(query.query)] = query
  return queries
}

function addFetchingQueryToState (state, query) {
  var queries = addQuery(state.queries, { isFetching: true, query: query })
  return Object.assign({}, state, { queries: queries })
}

function addItemsToCache (cached, items) {
  var itemsMapped = {}
  items.forEach((item) => {
    itemsMapped[item.id] = { item, isFetching: false }
  })
  return Object.assign({}, cached, itemsMapped)
}

function assignRelationshipToResource (cached, itemId, type, related) {
  var newRelationship = {}
  newRelationship[type] = related.filter((other) => other.id !== itemId)
  cached[itemId].item.related = Object.assign({}, cached[itemId].item.related, newRelationship)
  if (!cached[itemId]._version) cached[itemId]._version = 1
  cached[itemId]._version += 1
}

// Resources queries:

function resourcesQueryReducer (resourcesState, action) {
  var queries = null
  var cached = null

  switch (action.type) {
    case constants.FETCH_RESOURCES:
      return addFetchingQueryToState(resourcesState, action.query)

    case constants.RECEIVE_RESOURCES:
      queries = addQuery(resourcesState.queries, { isFetching: false, query: action.query, items: action.items, total: action.total })
      cached = addItemsToCache(resourcesState.cached, action.items)

      if (action.context === 'owi') {
        action.items.forEach((item) => assignRelationshipToResource(cached, item.id, 'owi', action.items))
      }
      if (action.context === 'children') {
        if (action.items.length > 0) assignRelationshipToResource(cached, action.items[0].parentUri, 'children', action.items)
      }

      return Object.assign({}, resourcesState, { queries: queries, cached: cached })

    default:
      return resourcesState
  }
}

// Aggregations

function aggregationsReducer (resourcesState, action) {
  var aggregationsQueries = null

  // console.log('resources reduce: ', resourcesState)
  switch (action.type) {
    case constants.FETCH_RESOURCES_AGGREGATIONS:
      aggregationsQueries = addQuery(resourcesState.queries, { isFetching: true, query: action.query })
      return Object.assign({}, resourcesState, { aggregationsQueries })

    case constants.RECEIVE_RESOURCES_AGGREGATIONS:
      aggregationsQueries = addQuery(resourcesState.aggregationsQueries, { isFetching: false, query: action.query, aggregations: action.aggregations })
      return Object.assign({}, resourcesState, { aggregationsQueries })

    default:
      return resourcesState
  }
}

// Resource

function resourceReducer (resourcesState, action) {
  var cached = null
  var queries = null

  switch (action.type) {
    case constants.FETCH_RESOURCE:
      return addFetchingQueryToState(resourcesState, action.query)

    case constants.RECEIVE_RESOURCE:
      queries = addQuery(resourcesState.queries, { isFetching: false, query: action.query })
      // queries = Object.assign({}, resourcesState.queries)
      cached = addItemsToCache(resourcesState.cached, [action.item])
      return Object.assign({}, resourcesState, { queries: queries, cached: cached, currentResource: cached[resourcesState.currentResourceId] })

    default:
      return resourcesState
  }
}

// Random Resources

// function randomResourcesQueryReducer (resourcesState, action) {
function randomResourceReducer (resourcesState, action) {
  switch (action.type) {
    case constants.FETCH_RANDOM_RESOURCES:
      return Object.assign({}, resourcesState, {
        randoms: { isFetching: true }
      })
    case constants.RECEIVE_RANDOM_RESOURCES:
      console.log('receiving randoms')
      return Object.assign({}, resourcesState, {
        randoms: { isFetching: false, items: action.items }
      })
    default:
      return resourcesState
  }
}

// Central dispatch for all resources reductions:

export default function resources (state = { queries: {}, aggregationsQueries: {}, cached: {}, currentResource: { isFetching: true } }, action) {
  switch (action.type) {
    case constants.FETCH_RESOURCES:
    case constants.RECEIVE_RESOURCES:
      return Object.assign({}, state, resourcesQueryReducer(state, action))

    case constants.FETCH_RESOURCES_AGGREGATIONS:
    case constants.RECEIVE_RESOURCES_AGGREGATIONS:
      return Object.assign({}, state, aggregationsReducer(state, action))

    case constants.FETCH_RESOURCE:
    case constants.RECEIVE_RESOURCE:
      return Object.assign({}, state, resourceReducer(state, action))

    case constants.FETCH_RANDOM_RESOURCES:
    case constants.RECEIVE_RANDOM_RESOURCES:
      return Object.assign({}, state, randomResourceReducer(state, action))

    case constants.SET_RESOURCES_QUERY:
      return Object.assign({}, state, { currentQueryId: queryId(action.query) })

    case constants.SET_CURRENT_RESOURCE_ID:
      return Object.assign({}, state, { currentResourceId: action.id, currentResource: state.cached[action.id] ? state.cached[action.id] : { isFetching: true } })

    default:
      return state
  }
}

