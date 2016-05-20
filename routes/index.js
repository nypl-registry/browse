import React from 'react'
import { Route } from 'react-router'

import App from '../app/app'
import Agents from '../app/containers/agents'
import AgentsSearchResults from '../app/containers/agentsSearchResults'
import AgentPage from '../app/containers/agentPage'
import ResourcePage from '../app/containers/resourcePage'
import ResourcesSearchResults from '../app/containers/resourcesSearchResults'
import Resources from '../app/containers/resources'

var routes = (
  <Route path='/' component={App} >
    <Route path='/agents' component={Agents} />
    <Route path='/agents/search' component={AgentsSearchResults} />
    <Route path='/agents/:id' component={AgentPage} />
    <Route path='/resources' component={Resources} />
    <Route path='/resources/search' component={ResourcesSearchResults} />
    <Route path='/resources/:id' component={ResourcePage} />
  </Route>
)

export default routes
