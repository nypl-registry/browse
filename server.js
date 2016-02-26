var path = require('path');
var express = require('express');

var webpack = require('webpack');


var __DEV__ = process.env.NODE_ENV === 'development';
var port = 80;
var API_URL = "http://45.55.45.240/api/v1/"

var app = express();



if (__DEV__) {
  var port = 5000;
  var API_URL = "http://localhost:3000/api/v1/"
  var webpackConfig = require('./webpack.config.dev');
  var compiler = webpack(webpackConfig);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}

app.API_URL = API_URL
app.use(express.static(path.join(__dirname, __DEV__ ? 'app' : 'dist')));


require('./routes/context')(app)
require('./routes/resources')(app)

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, __DEV__ ? 'app' : 'dist', 'index.html'), null, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
  });
});

// TODO: use node-config, and read port from config file!

app.listen(port, '0.0.0.0', function (err) {
  if (err) {
    console.error(err);
    return;
  }
  console.info('==> 🌍  Listening on port ' + port + '. Open http://0.0.0.0:' + port + ' in your browser');
});
