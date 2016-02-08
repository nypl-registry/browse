var axios = require('axios')



//var API_URL = "http://45.55.45.240/api/"
//var API_URL = "http://localhost:3000/api/"
var API_URL = window.browseAPI

var colors = [ "aqua",  "aquamarine",     "bisque",  "black",  "blue",  "blueviolet",  "brown",  "burlywood",  "cadetblue",  "chartreuse",  "chocolate",  "coral",  "cornflowerblue",  "cornsilk",  "crimson",  "cyan",  "darkblue",  "darkcyan",  "darkgoldenrod",  "darkgray",  "darkgreen",  "darkgrey",  "darkkhaki",  "darkmagenta",  "darkolivegreen",  "darkorange",  "darkorchid",  "darkred",  "darksalmon",  "darkseagreen",  "darkslateblue",  "darkslategray",  "darkslategrey",  "darkturquoise",  "darkviolet",  "deeppink",  "deepskyblue",  "dimgray",  "dimgrey",  "dodgerblue",  "firebrick",   "forestgreen",  "fuchsia",  "gainsboro",    "gold",  "goldenrod",  "gray",  "green",  "greenyellow",  "grey",  "honeydew",  "hotpink",  "indianred",  "indigo",  "khaki",  "lavender",   "lawngreen",  "lemonchiffon",  "lightblue",  "lightcoral",  "lightgoldenrodyellow",  "lightgray",  "lightgreen",  "lightgrey",  "lightpink",  "lightsalmon",  "lightseagreen",  "lightskyblue",  "lightslategray",  "lightslategrey",  "lightsteelblue",  "lime",  "limegreen",    "magenta",  "maroon",  "mediumaquamarine",  "mediumblue",  "mediumorchid",  "mediumpurple",  "mediumseagreen",  "mediumslateblue",  "mediumspringgreen",  "mediumturquoise",  "mediumvioletred",  "midnightblue",  "moccasin",   "navy",  "olive",  "olivedrab",  "orange",  "orangered",  "orchid",  "palegreen",  "paleturquoise",  "palevioletred",  "peru",  "pink",  "plum",  "powderblue",  "purple",  "rebeccapurple",  "red",  "rosybrown",  "royalblue",  "saddlebrown",  "salmon",  "sandybrown",  "seagreen",  "sienna",  "silver",  "skyblue",  "slateblue",  "slategray",  "slategrey",  "springgreen",  "steelblue",  "tan",  "teal",  "thistle",  "tomato",  "turquoise",  "violet",    "yellow",  "yellowgreen"]

export function randomColor(){
  return colors[Math.floor(Math.random()*colors.length)];
}

export function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};


export function returnAgentData(agent){

  var returnAgent={
    birthDate:false,
    deathDate: false,
    rdfType: false,
    wikipedia: false,
    viaf: false,
    wikidata: false,
    lc: false,
    dbpedia: false,
    topFiveTerms: []
  }


  if (agent['dbo:birthDate']) if (agent['dbo:birthDate'][0]) returnAgent.birthDate = agent['dbo:birthDate'][0].objectLiteral
  if (agent['dbo:deathDate']) if (agent['dbo:deathDate'][0]) returnAgent.birthDate = agent['dbo:deathDate'][0].objectLiteral  

  if (returnAgent.birthDate == returnAgent.deathDate) returnAgent.deathDate = false

  if (agent['rdf:type']){
    agent['rdf:type'].forEach(a =>{
      if (a.objectUri){
        if (a.objectUri.split('foaf:').length>1) returnAgent.rdfType = a.objectUri
      }
    })
  }

  if (agent['skos:exactMatch']){
    agent['skos:exactMatch'].forEach(a =>{
      if (a.objectUri){
        if (a.objectUri.split('viaf:').length>1) returnAgent.viaf = a.objectUri.split('viaf:')[1]
        if (a.objectUri.split('wikidata:').length>1) returnAgent.wikidata = a.objectUri.split('wikidata:')[1]        
        if (a.objectUri.split('lc:').length>1) returnAgent.lc = a.objectUri.split('lc:')[1]        
        if (a.objectUri.split('dbr:').length>1) returnAgent.dbpedia = a.objectUri.split('dbr:')[1]        
      }
    })
  }

  if (agent['foaf:isPrimaryTopicOf']) if (agent['foaf:isPrimaryTopicOf'][0]) returnAgent.wikipedia = agent['foaf:isPrimaryTopicOf'][0].objectLiteral

  if (agent.topFiveTerms){
    returnAgent.topFiveTerms = agent.topFiveTerms
  }


  return returnAgent
}



// Network stuff
export function searchAgentByName(name,cb) {

  axios.get(API_URL+'agents', {
    params: {
      action: 'searchbyname',
      value: name
    }
  })
  .then(function (response) {
    cb(response)
    console.log(response);
  })
  .catch(function (response) {
    console.log(response);
  });



}

export function randomAgents(cb) {

  axios.get(API_URL+'agents', {
    params: {
      action: 'random'
    }
  })
  .then(function (response) {
    cb(response)

  })
  .catch(function (response) {
    console.log(response);
  });

}



export function agentOverview(id,cb) {

  axios.get(API_URL+'agents', {
    params: {
      action: 'overview',
      value: id
    }
  })
  .then(function (response) {

    cb(response)

  })
  .catch(function (response) {
    console.log(response);
  });

}

export function agentResources(id,cb) {
  axios.get(API_URL+'agents', {
    params: {
      action: 'resources',
      value: id
    }
  })
  .then(function (response) {
    cb(response)
  })
  .catch(function (response) {
    console.log(response);
  });

}

export function agentImagesOf(id,cb) {
  axios.get(API_URL+'agents', {
    params: {
      action: 'imagesof',
      value: id
    }
  })
  .then(function (response) {
    cb(response)
  })
  .catch(function (response) {
    console.log(response);
  });

}


export function resourceOverview(id,cb) {

  axios.get(API_URL+'resources', {
    params: {
      action: 'overview',
      value: id
    }
  })
  .then(function (response) {

    cb(response)

  })
  .catch(function (response) {
    console.log(response);
  });

}

