window.browse = window.browse || {};

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link } from 'react-router'


import { createHistory, useBasename } from 'history'

import { Provider } from 'react-redux'

import configureStore from './configureStore'

import App from './app';
import Agents from './components/agents/agents';
import AgentSearchResults from './components/agents/agentsSearchResults';
import AgentPage from './components/agents/agentPage';
import ResourcePage from './components/resources/resourcePage';
import ResourceSearchResults from './components/resources/resourcesSearchResults';
import Resources from './components/resources/resources';


import './styles/nypl_styleguide.css';
import './styles/skeleton.css';
import './styles/browse.scss';


const store = configureStore()

const history = useBasename(createHistory)({
  basename: '/'
})

//oh...how do I do this...?
window.browseHistory = history
window.apiHistory = []



// store.dispatch({ type: "counter", action: "INCREMENT"})
// store.dispatch({ type: "history", history: "YEAH"})









render((
	<Provider store={store}>
		<Router history={history}>
			<Route path="/" component={App}/>    
			<Route path="/agents" component={Agents}/>
			<Route path="/agents/search" component={AgentSearchResults}/>
			<Route path="/agents/:id" component={AgentPage}/>
			<Route path="/resources" component={Resources}/>
			<Route path="/resources/search" component={ResourceSearchResults}/>
			<Route path="/resources/:id" component={ResourcePage}/>



		</Router>
	</Provider>
), document.getElementById('app'))
