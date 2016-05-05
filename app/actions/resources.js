import { stringify } from 'qs'
import Resource from '../models/resource.js'

export const constants = {
  SET_RESOURCES_QUERY: 'SET_RESOURCES_QUERY',
  SET_CURRENT_RESOURCE_ID: 'SET_CURRENT_RESOURCE_ID',

  FETCH_RESOURCES: 'FETCH_RESOURCES',
  RECEIVE_RESOURCES: 'RECEIVE_RESOURCES',

  FETCH_RANDOM_RESOURCES: 'FETCH_RANDOM_RESOURCES',
  RECEIVE_RANDOM_RESOURCES: 'RECEIVE_RANDOM_RESOURCES',

  FETCH_RESOURCES_AGGREGATIONS: 'FETCH_RESOURCES_AGGREGATIONS',
  RECEIVE_RESOURCES_AGGREGATIONS: 'RECEIVE_RESOURCES_AGGREGATIONS',

  FETCH_RESOURCE: 'FETCH_RESOURCE',
  RECEIVE_RESOURCE: 'RECEIVE_RESOURCE',

  FETCH_RESOURCE_CHILDREN: 'FETCH_RESOURCE_CHILDREN',
  RECEIVE_RESOURCE_CHILDREN: 'RECEIVE_RESOURCE_CHILDREN'
}

export function queryId (query) {
  return stringify(query)
}

// Resources:

export const requestResources = (query, context) => {
  return {
    type: constants.FETCH_RESOURCES,
    query,
    context
  }
}

export function receiveResources (query, items, total, context) {
  return {
    type: constants.RECEIVE_RESOURCES,
    query: query,
    items: items,
    total: total,
    receivedAt: Date.now(),
    context
  }
}

function fetchResources (query, context) {
  return (dispatch) => {
    dispatch(requestResources(query, context))
    return Resource.find(query, (results) => dispatch(receiveResources(query, results.results, results.total, context)))
  }
}

export function fetchResourcesIfNeeded (query) {
  var _query = Object.assign({}, query)
  return (dispatch, getState) => {
    if (!getState().resources.queries[queryId(_query)]) {
      return dispatch(fetchResources(_query, 'keyword'))
    }
  }
}

// Random Resources

export const fetchRandomResources = (count) => {
  return (dispatch, getState) => {
    dispatch({ type: constants.FETCH_RANDOM_RESOURCES })
    return Resource.random(count, (results) => dispatch(receiveRandomResources(results.results)))
  }
}

export function receiveRandomResources (items) {
  return {
    type: constants.RECEIVE_RANDOM_RESOURCES,
    items: items,
    receivedAt: Date.now()
  }
}

// Resources Aggregations:

export function receiveResourcesAggregations (query, aggs) {
  return {
    type: constants.RECEIVE_RESOURCES_AGGREGATIONS,
    query: query,
    aggregations: aggs.results,
    receivedAt: Date.now()
  }
}

function fetchResourcesAggregations (query) {
  return (dispatch) => {
    dispatch({ type: constants.FETCH_RESOURCES_AGGREGATIONS, query: query })
    return Resource.aggregations(query, (results) => dispatch(receiveResourcesAggregations(query, results)))
  }
}

export function fetchResourcesAggregationsIfNeeded (query) {
  var _query = Object.assign({}, query)
  return (dispatch, getState) => {
    if (!getState().resources.aggregationsQueries[queryId(_query)]) {
      return dispatch(fetchResourcesAggregations(_query))
    }
  }
}

// Resource:

function receiveResource (query, item) {
  return {
    type: constants.RECEIVE_RESOURCE,
    query: query,
    item: item
  }
}

function fetchResource (uri) {
  return (dispatch) => {
    var query = { action: 'lookup', uri: uri }
    dispatch({ type: constants.FETCH_RESOURCE, query })
    Resource.lookup(uri, (result) => dispatch(receiveResource(query, result)))
  }
}

export function fetchResourceIfNeeded (uri) {
  return (dispatch, getState) => {
    var query = { action: 'lookup', value: uri }
    if (!getState().resources.queries[queryId(query)] && !getState().resources.cached[uri]) {
      return dispatch(fetchResource(uri))
    }
  }
}

export function fetchResourceChildrenIfNeeded (uri) {
  return (dispatch, getState) => {
    var query = { filters: { parent: uri } }
    if (!getState().resources.queries[queryId(query)]) {
      return dispatch(fetchResources(query, 'children'))
    }
  }
}

export function fetchByOwiIfNeeded (owi) {
  return (dispatch, getState) => {
    var query = { action: 'byowi', value: owi }
    if (!getState().resources.queries[queryId(query)]) {
      return dispatch(fetchResources(query, 'owi'))
    }
  }
}

// View concerns:

export function setCurrentResourceId (id) {
  return (dispatch, getState) => {
    if (getState().resources.currentResourceId !== id) {
      dispatch({ type: constants.SET_CURRENT_RESOURCE_ID, id })
      dispatch(fetchResourceIfNeeded(id))
      dispatch(fetchResourceChildrenIfNeeded(id))
    }
  }
}

export function setResourcesQuery (query) {
  return (dispatch, getState) => {
    if (getState().resources.currentQueryId !== queryId(query)) {
      dispatch(fetchResourcesIfNeeded(query))
      dispatch(fetchResourcesAggregationsIfNeeded(query))
      return dispatch({
        type: constants.SET_RESOURCES_QUERY,
        query
      })
    }
  }
}

