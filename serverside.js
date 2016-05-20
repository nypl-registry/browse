var path = require('path')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()

var React = require('react')
var ReactDOMServer = require('react-dom/server')

require('babel-register')({
  presets: [ 'react' ]
})

var configureStore = require('./app/configureStore')
var routes = require('./routes')

app.set('port', (process.env.PORT || 3000))

// app.use('/', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Additional middleware which will set headers that we need on each request.
app.use(function (req, res, next) {
  // Set permissive CORS header - this allows this server to be used only as
  // an API server in conjunction with something like webpack-dev-server.
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Disable caching so we'll always get the latest comments.
  res.setHeader('Cache-Control', 'no-cache')
  next()
})

app.get(['/', '/another-page'], function (req, res) {
  var ReactRouter = require('react-router')
  var match = ReactRouter.match
  var RouterContext = React.createFactory(ReactRouter.RouterContext)
  var Provider = React.createFactory(require('react-redux').Provider)
  // var routes = require('./public/routes.js').routes
  // var store = require('./public/redux-store')

  // var initialState = {}

  const store = configureStore.default()

  match({routes: routes.default, location: req.url}, function (error, redirectLocation, renderProps) {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      res.send('<!DOCTYPE html>' +
        ReactDOMServer.renderToString(
          Provider({store: store}, RouterContext(renderProps))
        )
      )
    } else {
      res.status(404).send('Not found')
    }
  })
})

app.listen(app.get('port'), function () {
  console.log('Server started: http://localhost:' + app.get('port') + '/')
})
