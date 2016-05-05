window.browse = window.browse || {}

require('es6-promise').polyfill()

import React from 'react'
import { render } from 'react-dom'

import { Router, Route, useRouterHistory } from 'react-router'
// import { syncHistoryWithStore } from 'react-router-redux'
import qs from 'qs'

import { Provider } from 'react-redux'

import configureStore from './configureStore'

const store = configureStore()

// console.log('hist: ', rr, browserHistory)
// Create an enhanced history that syncs navigation events with the store
// const history = syncHistoryWithStore(browserHistory, store)

import createBrowserHistory from 'history/lib/createBrowserHistory'
const createAppHistory = useRouterHistory(createBrowserHistory)
// Override default query parsing with qs query parsing (cause otherwise we lose nested params)
// Per https://github.com/mjackson/history/blob/master/docs/QuerySupport.md
const appHistory = createAppHistory({
  parseQueryString: qs.parse,
  stringifyQuery: qs.stringify
})
const history = appHistory // syncHistoryWithStore(appHistory, store)

import App from './app'
import Agents from './containers/agents'
import AgentsSearchResults from './containers/agentsSearchResults'
import AgentPage from './containers/agentPage'
import ResourcePage from './containers/resourcePage'
import ResourcesSearchResults from './containers/resourcesSearchResults'
import Resources from './containers/resources'

import './styles/nypl_styleguide.css'
import './styles/skeleton.css'
import './styles/browse.scss'

window.apiHistory = []

render((
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App} />
      <Route path='/agents' component={Agents} />
      <Route path='/agents/search' component={AgentsSearchResults} />
      <Route path='/agents/:id' component={AgentPage} />
      <Route path='/resources' component={Resources} />
      <Route path='/resources/search' component={ResourcesSearchResults} />
      <Route path='/resources/:id' component={ResourcePage} />
    </Router>
  </Provider>
  ), document.getElementById('app'))
