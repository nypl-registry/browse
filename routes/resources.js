var axios = require("axios")


module.exports = function(app){	

	app.get('/resources/:id/nt', function (req, res) {
		axios.get(app.API_URL+"resources/?action=ntriples&value="+req.params.id)
		.then(function (response) {
			res.type('text/plain')
			res.status(200).send(response.data)
		})
		.catch(function (response) {
			res.type('text/plain')
			res.status(500).send("")
		})  	
		return
	})

	app.get('/resources/:id/jsonld', function (req, res) {
		axios.get(app.API_URL+"resources/?action=jsonld&value="+req.params.id)
		.then(function (response) {
			res.type('application/ld+json')

			res.status(200).send(JSON.stringify(response.data,null,2))
		})
		.catch(function (response) {
			res.type('application/ld+json')
			res.status(500).send("")
		})  	
		return
	})

    //other routes..
}