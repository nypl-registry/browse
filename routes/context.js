var axios = require('axios')

module.exports = function (app) {
  app.get('/context_all.jsonld', function (req, res) {
    axios.get(app.API_URL + 'context_all.jsonld')
      .then(function (response) {
        res.type('application/ld+json')
        res.status(200).send(JSON.stringify(response.data, null, 2))
      })
      .catch(function (response) {
        res.type('application/ld+json')
        res.status(500).send('{}')
      })
    return
  })

// other routes..
}
