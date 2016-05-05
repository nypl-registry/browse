import { constants, queryId } from '../actions/agents'

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

function assignRelationshipToAgent (cached, itemId, type, related) {
  var newRelationship = {}
  newRelationship[type] = related.filter((other) => other.id !== itemId)
  cached[itemId].item.related = Object.assign({}, cached[itemId].item.related, newRelationship)
}

// Agents queries:

function agentsQueryReducer (agentsState, action) {
  var queries = null
  var cached = null

  switch (action.type) {
    case constants.FETCH_AGENTS:
      return addFetchingQueryToState(agentsState, action.query)

    case constants.RECEIVE_AGENTS:
      queries = addQuery(agentsState.queries, { isFetching: false, query: action.query, items: action.items, total: action.total })
      cached = addItemsToCache(agentsState.cached, action.items)

      if (action.context === 'owi') {
        action.items.forEach((item) => assignRelationshipToAgent(cached, item.id, 'owi', action.items))
      }
      if (action.context === 'children') {
        if (action.items.length > 0) assignRelationshipToAgent(cached, action.items[0].parentUri, 'children', action.items)
      }

      return Object.assign({}, agentsState, { queries: queries, cached: cached })

    default:
      return agentsState
  }
}

// Aggregations

function aggregationsReducer (agentsState, action) {
  var aggregationsQueries = null

  switch (action.type) {
    case constants.FETCH_AGENTS_AGGREGATIONS:
      aggregationsQueries = addQuery(agentsState.aggregationsQueries, { isFetching: true, query: action.query })
      return Object.assign({}, agentsState, { aggregationsQueries })

    case constants.RECEIVE_AGENTS_AGGREGATIONS:
      aggregationsQueries = addQuery(agentsState.aggregationsQueries, { isFetching: false, query: action.query, aggregations: action.aggregations })
      return Object.assign({}, agentsState, { aggregationsQueries })

    default:
      return agentsState
  }
}

// Agent

function agentReducer (agentsState, action) {
  var cached = null
  var queries = null

  switch (action.type) {
    case constants.FETCH_AGENT:
      return addFetchingQueryToState(agentsState, action.query)

    case constants.RECEIVE_AGENT:
      queries = addQuery(agentsState.queries, { isFetching: false, query: action.query })
      cached = addItemsToCache(agentsState.cached, [action.item])
      return Object.assign({}, agentsState, { queries: queries, cached: cached })

    default:
      return agentsState
  }
}

// Random Agents

function randomAgentReducer (state, action) {
  switch (action.type) {
    case constants.FETCH_RANDOM_AGENTS:
      return Object.assign({}, state, {
        randoms: { isFetching: true }
      })
    case constants.RECEIVE_RANDOM_AGENTS:
      console.log('receiving randoms')
      return Object.assign({}, state, {
        randoms: { isFetching: false, items: action.items }
      })
    default:
      return state
  }
}

// Central dispatch for all agents reductions:

export default function agents (state = { queries: {}, aggregationsQueries: {}, cached: {} }, action) {
  switch (action.type) {
    case constants.FETCH_AGENTS:
    case constants.RECEIVE_AGENTS:
      return Object.assign({}, state, agentsQueryReducer(state, action))

    case constants.FETCH_AGENTS_AGGREGATIONS:
    case constants.RECEIVE_AGENTS_AGGREGATIONS:
      return Object.assign({}, state, aggregationsReducer(state, action))

    case constants.FETCH_AGENT:
    case constants.RECEIVE_AGENT:
      return Object.assign({}, state, agentReducer(state, action))

    case constants.FETCH_RANDOM_AGENTS:
    case constants.RECEIVE_RANDOM_AGENTS:
      return Object.assign({}, state, randomAgentReducer(state, action))

    case constants.SET_AGENTS_QUERY:
      return Object.assign({}, state, { currentQueryId: queryId(action.query) })

    case constants.SET_CURRENT_AGENT_ID:
      return Object.assign({}, state, { currentAgentId: action.id })

    default:
      return state
  }
}

