// import fetch from 'isomorphic-fetch'
import qs from 'qs'
import Resource from '../models/resource.js'
import { push } from 'react-router-redux'

export const SET_RESOURCES_QUERY = 'SET_RESOURCES_QUERY'
export const RECEIVE_RESOURCES = 'RECEIVE_RESOURCES'

// Resources:

export const requestResources = (query) => {
  return {
    type: SET_RESOURCES_QUERY,
    query
  }
}

export function receiveResources (items, total) {
  return {
    type: RECEIVE_RESOURCES,
    items: items,
    total: total,
    receivedAt: Date.now()
  }
}

function fetchResources (query) {
  return (dispatch) => {
    dispatch(requestResources(query))
    return Resource.find(query, (results) => dispatch(receiveResources(results.results, results.total)))
  }
}

function shouldFetchResources (state, query) {
  // console.log('shouldFetchResources = ', state.resources.query !== query, state.resources.query, query)
  // console.log('shouldFetchResources = ', qs.stringify(state.resources.query), ' !== ', qs.stringify(query), qs.stringify(state.resources.query) !== qs.stringify(query))
  return qs.stringify(state.resources.query) !== qs.stringify(query)
}

export function fetchResourcesIfNeeded (query) {
  var _query = Object.assign({}, query)
  return (dispatch, getState) => {
    if (shouldFetchResources(getState(), _query)) {
      return dispatch(fetchResources(_query))
    }
  }
}

// Random Resources

export const FETCH_RANDOM_RESOURCES = 'FETCH_RANDOM_RESOURCES'
export const RECEIVE_RANDOM_RESOURCES = 'RECEIVE_RANDOM_RESOURCES'

export const fetchRandomResources = (count) => {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_RANDOM_RESOURCES })
    return Resource.random(count, (results) => dispatch(receiveRandomResources(results.results)))
  }
}

export function receiveRandomResources (items) {
  return {
    type: RECEIVE_RANDOM_RESOURCES,
    items: items,
    receivedAt: Date.now()
  }
}

// Resources Aggregations:

export const FETCH_RESOURCES_AGGREGATIONS = 'FETCH_RESOURCES_AGGREGATIONS'
export const RECEIVE_RESOURCES_AGGREGATIONS = 'RECEIVE_RESOURCES_AGGREGATIONS'

export function receiveResourcesAggregations (aggs) {
  return {
    type: RECEIVE_RESOURCES_AGGREGATIONS,
    aggregations: aggs.results,
    receivedAt: Date.now()
  }
}

function fetchResourcesAggregations (query) {
  return (dispatch) => {
    dispatch({ type: FETCH_RESOURCES_AGGREGATIONS, aggregationsQuery: query })
    return Resource.aggregations(query, (results) => dispatch(receiveResourcesAggregations(results)))
  }
}

function shouldFetchResourcesAggregations (state, query) {
  return qs.stringify(state.resources.aggregationsQuery) !== qs.stringify(query)
}

export function fetchResourcesAggregationsIfNeeded (query) {
  var _query = Object.assign({}, query)
  return (dispatch, getState) => {
    if (shouldFetchResourcesAggregations(getState(), _query)) {
      return dispatch(fetchResourcesAggregations(_query))
    }
  }
}

// Resource:

export const FETCH_RESOURCE = 'FETCH_RESOURCE'
export const RECEIVE_RESOURCE = 'RECEIVE_RESOURCE'

export function receiveResource (item) {
  return {
    type: RECEIVE_RESOURCE,
    item: item
  }
}

function fetchResource (uri) {
  return (dispatch) => {
    dispatch({ type: FETCH_RESOURCE, uri: uri })
    return Resource.lookup(uri, (result) => dispatch(receiveResource(result)))
  }
}
export function fetchResourceIfNeeded (uri) {
  return (dispatch, getState) => {
    if (!getState().resource || getState().resource.uri !== uri) {
      return dispatch(fetchResource(uri))
    }
  }
}

// Navigation

export function transitionTo (path, params) {
  return (dispatch, getState) => {
    console.log('dispatching push: ', path, params)
    path = `${path}?${qs.stringify(params)}`
    dispatch(push(path))
  }
}
