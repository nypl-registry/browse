var axios = require('axios')



//var API_URL = "http://45.55.45.240/api/"
//var API_URL = "http://localhost:3000/api/"
var API_URL = window.browseAPI

var colors = [ "aqua",  "aquamarine", "bisque",  "black",  "blue",  "blueviolet",  "brown",  "burlywood",  "cadetblue",  "chartreuse",  "chocolate",  "coral",  "cornflowerblue",  "cornsilk",  "crimson",  "cyan",  "darkblue",  "darkcyan",  "darkgoldenrod",  "darkgray",  "darkgreen",  "darkgrey",  "darkkhaki",  "darkmagenta",  "darkolivegreen",  "darkorange",  "darkorchid",  "darkred",  "darksalmon",  "darkseagreen",  "darkslateblue",  "darkslategray",  "darkslategrey",  "darkturquoise",  "darkviolet",  "deeppink",  "deepskyblue",  "dimgray",  "dimgrey",  "dodgerblue",  "firebrick",   "forestgreen",  "fuchsia",  "gainsboro",    "gold",  "goldenrod",  "gray",  "green",  "greenyellow",  "grey",  "honeydew",  "hotpink",  "indianred",  "indigo",  "khaki",  "lavender",   "lawngreen",  "lemonchiffon",  "lightblue",  "lightcoral",  "lightgoldenrodyellow",  "lightgray",  "lightgreen",  "lightgrey",  "lightpink",  "lightsalmon",  "lightseagreen",  "lightskyblue",  "lightslategray",  "lightslategrey",  "lightsteelblue",  "lime",  "limegreen",    "magenta",  "maroon",  "mediumaquamarine",  "mediumblue",  "mediumorchid",  "mediumpurple",  "mediumseagreen",  "mediumslateblue",  "mediumspringgreen",  "mediumturquoise",  "mediumvioletred",  "midnightblue",  "moccasin",   "navy",  "olive",  "olivedrab",  "orange",  "orangered",  "orchid",  "palegreen",  "paleturquoise",  "palevioletred",  "peru",  "pink",  "plum",  "powderblue",  "purple",  "rebeccapurple",  "red",  "rosybrown",  "royalblue",  "saddlebrown",  "salmon",  "sandybrown",  "seagreen",  "sienna",  "silver",  "skyblue",  "slateblue",  "slategray",  "slategrey",  "springgreen",  "steelblue",  "tan",  "teal",  "thistle",  "tomato",  "turquoise",  "violet",    "yellow",  "yellowgreen"]

export function randomColor(){
  return colors[Math.floor(Math.random()*colors.length)]
}

export function debounce(func, wait, immediate) {
  var timeout
  return function() {
    var context = this, args = arguments
    var later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

function apiHistoryPush(desc,url){

  window.apiHistory.push({ desc: desc, url: url })

}


// Network stuff
export function searchAgentByName(name,cb) {

  apiHistoryPush(`Searching for agents named: '${name}'`, `${API_URL}agents/?action=searchbyname&value=${name}`)

  axios.get(API_URL+'agents', {
    params: {
      action: 'searchbyname',
      value: name
    }
  })
  .then(function (response) {
    cb(response)
  })
  .catch(function (response) {
    console.log(response)
  })



}

export function randomAgents(cb) {

  apiHistoryPush(`Random Agent`, `${API_URL}agents/?action=random`)



  axios.get(API_URL+'agents', {
    params: {
      action: 'random'
    }
  })
  .then(function (response) {
    cb(response)
  })
  .catch(function (response) {
    console.log(response)
  })
}



export function agentOverview(id,cb) {

  apiHistoryPush(`Agent Overview: '${id}'`, `${API_URL}agents/?action=overview&value=${id}`)



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
    console.log(response)
  })
}

export function agentResources(id,cb) {

  apiHistoryPush(`Agent Resources: '${id}'`, `${API_URL}agents/?action=resources&value=${id}`)


  axios.get(API_URL+'agents', {
    params: {
      action: 'resources',
      value: id
    }
  })
  .then(function (response) {

    //make it into a response it expects
    var results = { contributed: {}, about: {} }
    response.data.itemListElement.forEach(r => {
      if (r.isContributor){
        if (!results.contributed[r.prefLabel]) results.contributed[r.prefLabel] = []
        results.contributed[r.prefLabel].push({
          title : r.result.title,
          startYear : r.result.startYear,
          uri : r.result['@id'].split(":")[1],
        })
      }else{
        if (!results.about[r.prefLabel]) results.about[r.prefLabel] = []
        results.about[r.prefLabel].push({
          title : r.result.title,
          startYear : r.result.startYear,
          uri : r.result['@id'].split(":")[1],
        })
      }
    })
    cb(results)
  })
  .catch(function (response) {
    console.log(response)
  })

}



export function agentImagesOf(id,cb) {

  apiHistoryPush(`Images of Agent: '${id}'`, `${API_URL}agents/?action=imagesof&value=${id}`)


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
    console.log(response)
  })

}
export function resourceByOwi(id,cb) {

  apiHistoryPush(`OWI Search: '${id}'`, `${API_URL}resources/?action=byowi&value=${id}`)


  axios.get(API_URL+'resources', {
    params: {
      action: 'byowi',
      value: id
    }
  })
  .then(function (response) {
    cb(response)
  })
  .catch(function (response) {
    console.log(response)
  })

}

export function resourceOverview(id,cb) {

    apiHistoryPush(`Overview for resource: '${id}'`, `${API_URL}resources/?action=overview&value=${id}`)


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
    console.log(response)
  })

}

