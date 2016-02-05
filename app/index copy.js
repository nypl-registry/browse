window.browse = window.browse || {};

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link } from 'react-router'


import { createHistory, useBasename } from 'history'

import { Provider } from 'react-redux'

import configureStore from './configureStore'

import App from './app';
import Agents from './agents';
import AgentSearchResults from './agentsSearchResults';


import './styles/nypl_styleguide.css';
import './styles/skeleton.css';
import './styles/browse.scss';


const store = configureStore()

const history = useBasename(createHistory)({
  basename: '/'
})

//oh...how do I do this...?
window.browseHistory = history




// store.dispatch({ type: "counter", action: "INCREMENT"})
// store.dispatch({ type: "history", history: "YEAH"})









render((
	<Provider store={store}>
		<Router test="whhhhat" history={history}>
			<Route path="/" component={App}/>    
			<Route path="/agents" component={Agents}/>
			<Route path="/agents/search/:term" component={AgentSearchResults}/>


		</Router>
	</Provider>
), document.getElementById('app'))
