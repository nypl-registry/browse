import { stringify } from 'qs'
import Agent from '../models/agent.js'

export const constants = {
  SET_AGENTS_QUERY: 'SET_AGENTS_QUERY',
  SET_CURRENT_AGENT_ID: 'SET_CURRENT_AGENT_ID',

  FETCH_AGENTS: 'FETCH_AGENTS',
  RECEIVE_AGENTS: 'RECEIVE_AGENTS',

  FETCH_RANDOM_AGENTS: 'FETCH_RANDOM_AGENTS',
  RECEIVE_RANDOM_AGENTS: 'RECEIVE_RANDOM_AGENTS',

  FETCH_AGENTS_AGGREGATIONS: 'FETCH_AGENTS_AGGREGATIONS',
  RECEIVE_AGENTS_AGGREGATIONS: 'RECEIVE_AGENTS_AGGREGATIONS',

  FETCH_AGENT: 'FETCH_AGENT',
  RECEIVE_AGENT: 'RECEIVE_AGENT'
}

export function queryId (query) {
  return stringify(query)
}

// Agents

export const requestAgents = (query, context) => {
  return {
    type: constants.FETCH_AGENTS,
    query,
    context
  }
}

export function receiveAgents (query, items, total, context) {
  return {
    type: constants.RECEIVE_AGENTS,
    query: query,
    items: items,
    total: total,
    receivedAt: Date.now(),
    context
  }
}

function fetchAgents (query, context) {
  return (dispatch) => {
    dispatch(requestAgents(query, context))
    return Agent.find(query, (results) => dispatch(receiveAgents(query, results.results, results.total, context)))
  }
}

export function fetchAgentsIfNeeded (query) {
  var _query = Object.assign({}, query)
  return (dispatch, getState) => {
    if (!getState().agents.queries[queryId(_query)]) {
      return dispatch(fetchAgents(_query, 'keyword'))
    }
  }
}

// Random Agents

export const fetchRandomAgents = (count) => {
  return (dispatch, getState) => {
    dispatch({ type: constants.FETCH_RANDOM_AGENTS })
    return Agent.random(count, (results) => dispatch(receiveRandomAgents(results.results)))
  }
}

export function receiveRandomAgents (items) {
  return {
    type: constants.RECEIVE_RANDOM_AGENTS,
    items: items,
    receivedAt: Date.now()
  }
}
// Agents Aggregations:

export function receiveAgentsAggregations (query, aggs) {
  return {
    type: constants.RECEIVE_AGENTS_AGGREGATIONS,
    query: query,
    aggregations: aggs.results,
    receivedAt: Date.now()
  }
}

function fetchAgentsAggregations (query) {
  return (dispatch) => {
    dispatch({ type: constants.FETCH_AGENTS_AGGREGATIONS, query: query })
    return Agent.aggregations(query, (results) => dispatch(receiveAgentsAggregations(query, results)))
  }
}

export function fetchAgentsAggregationsIfNeeded (query) {
  var _query = Object.assign({}, query)
  return (dispatch, getState) => {
    if (!getState().agents.aggregationsQueries[queryId(_query)]) {
      return dispatch(fetchAgentsAggregations(_query))
    }
  }
}

// Agent:

function receiveAgent (query, item) {
  return {
    type: constants.RECEIVE_AGENT,
    query: query,
    item: item
  }
}

function fetchAgent (uri) {
  return (dispatch) => {
    var query = { action: 'lookup', uri: uri }
    dispatch({ type: constants.FETCH_AGENT, query })
    Agent.lookup(uri, (result) => dispatch(receiveAgent(query, result)))
  }
}

export function fetchAgentIfNeeded (uri) {
  return (dispatch, getState) => {
    var query = { action: 'lookup', value: uri }
    if (!getState().agents.queries[queryId(query)] && !getState().agents.cached[uri]) {
      return dispatch(fetchAgent(uri))
    }
  }
}

// View concerns:

export function setCurrentAgentId (id) {
  return (dispatch, getState) => {
    if (getState().agents.currentAgentId !== id) {
      dispatch(fetchAgentIfNeeded(id))
      return dispatch({ type: constants.SET_CURRENT_AGENT_ID, id })
    }
  }
}

export function setAgentsQuery (query) {
  return (dispatch, getState) => {
    if (getState().agents.currentQueryId !== queryId(query)) {
      dispatch(fetchAgentsIfNeeded(query))
      dispatch(fetchAgentsAggregationsIfNeeded(query))
      return dispatch({
        type: constants.SET_AGENTS_QUERY,
        query
      })
    }
  }
}

/*
// Agent:

export const FETCH_AGENT = 'FETCH_AGENT'
export const RECEIVE_AGENT = 'RECEIVE_AGENT'

export function receiveAgent (item) {
  return {
    type: RECEIVE_AGENT,
    item: item
  }
}

function fetchAgent (uri) {
  return (dispatch) => {
    dispatch({ type: FETCH_AGENT, uri: uri })
    Agent.lookup(uri, (result) => dispatch(receiveAgent(result)))
  }
}

export function fetchAgentIfNeeded (uri) {
  return (dispatch, getState) => {
    if (!getState().agent || getState().agent.uri !== uri) {
      return dispatch(fetchAgent(uri))
    }
  }
}
*/
