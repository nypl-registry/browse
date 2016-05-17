var axios = require('axios')

// var API_URL = "http://45.55.45.240/api/"
// var API_URL = "http://localhost:3000/api/"
var API_URL = window.browseAPI

var colors = ['aqua', 'aquamarine', 'bisque', 'black', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'forestgreen', 'fuchsia', 'gainsboro', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred', 'indigo', 'khaki', 'lavender', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lime', 'limegreen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'moccasin', 'navy', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegreen', 'paleturquoise', 'palevioletred', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'rebeccapurple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'yellow', 'yellowgreen']

export function randomColor () {
  return colors[Math.floor(Math.random() * colors.length)]
}

export function randomColorFor (val) {
  var pos = parseInt(val) % colors.length
  return colors[pos]
}

export function hashRemoveKeys (hash) {
  var cleanedHash = Object.assign({}, hash)
  Array.from(arguments).slice(1).forEach((key) => {
    delete cleanedHash[key]
  })
  return cleanedHash
}

export function parseUrn (urn) {
  var parts = urn.split(':')
  return {
    type: parts[0] === 'res' ? 'resources' : parts[0],
    id: parseInt(parts[1])
  }
}

export function deepEqual (a1, a2) {
  // TODO: this should use a proper deep-diff that doesn't produce false positives:
  return JSON.stringify(a1) === JSON.stringify(a2)
}

// Given either an array/string, returns first value of array, or just the string, or null
export function firstValue (a) {
  switch (typeof a) {
    case 'object': return a[0]
    case 'string': return a
    case 'undefined': return null
    default: return a
  }
}

// Given either an array/string, returns first value of array, or just the string, or null
export function joinedValues (a, delim) {
  switch (typeof a) {
    case 'object': return a.join(delim)
    case 'string': return a
    case 'undefined': return null
    default: return a
  }
}

// Apply cb to given object (or all objects, if array)
export function eachValue (a, cb) {
  switch (typeof a) {
    case 'object': return a.map(cb)
    case 'undefined': return null
    default: if (a) return cb(a)
  }
}

export function urlFor (obj) {
  var type = null
  var id = null
  var matches = null
  if ((matches = obj['@id'].match(/^(agents|res|terms):(\d+)/))) {
    type = matches[1] === 'res' ? 'resources' : matches[1]
    id = parseInt(matches[2])
  }

  return `/${type}/${id}`
  /*
  var map = {
    'nypl:Resource': (obj) => `/resources/${obj['@id']}`,
    'nypl:Agent': (obj) => `/resources/${obj['@id']}`
  }
  for (let k in Object.keys(map)) { //  # .forEach((k) => {
    console.log('url for ', obj, map)
    if (((typeof obj['@type']) === 'string' && obj['@type'] === k) ||
          ((typeof obj['@type']) === 'object' && obj['@type'].indexOf(k))) {
      console.log('map: ', k)
      return map[k](obj)
    }
  }
  */
}

export function debounce (func, wait, immediate) {
  var timeout
  return function () {
    var context = this
    var args = arguments
    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

export function apiHistoryPush (desc, url) {
  window.apiHistory.push({ desc: desc, url: url })
}

// Network stuff
export function searchAgentByName (name, cb) {
  apiHistoryPush(`Searching for agents named: '${name}'`, `${API_URL}agents/?action=searchbyname&value=${name}`)

  axios.get(API_URL + 'agents', {
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

export function searchResourcesByTitle (title, cb) {
  apiHistoryPush(`Searching for resources titled: '${title}'`, `${API_URL}agents/?action=searchbytitle&value=${title}`)

  axios.get(API_URL + 'resources', {
    params: {
      action: 'search',
      value: title
    }
  })
    .then(function (response) {
      cb(response)
    })
    .catch(function (response) {
      console.log(response)
    })
}

export function randomResources (cb) {
  apiHistoryPush('Random Agent', `${API_URL}resources/?action=random`)

  axios.get(API_URL + 'resources', {
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

export function randomAgents (cb) {
  apiHistoryPush('Random Agent', `${API_URL}agents/?action=random`)

  axios.get(API_URL + 'agents', {
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

export function agentOverview (id, cb) {
  apiHistoryPush(`Agent Overview: '${id}'`, `${API_URL}agents/?action=overview&value=${id}`)

  axios.get(API_URL + 'agents', {
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

export function agentResources (id, cb) {
  apiHistoryPush(`Agent Resources: '${id}'`, `${API_URL}agents/?action=resources&value=${id}`)

  axios.get(API_URL + 'agents', {
    params: {
      action: 'resources',
      value: id
    }
  })
  .then(function (response) {
    // make it into a response it expects
    var results = { contributed: {}, about: {} }
    response.data.itemListElement.forEach((r) => {
      if (r.isContributor) {
        if (!results.contributed[r.prefLabel]) results.contributed[r.prefLabel] = []
        results.contributed[r.prefLabel].push({
          title: r.result.title,
          startYear: r.result.startYear,
          idBnum: r.result.idBnum,
          uri: r.result['@id'].split(':')[1]
        })
      } else {
        if (!results.about[r.prefLabel]) results.about[r.prefLabel] = []
        results.about[r.prefLabel].push({
          title: r.result.title,
          startYear: r.result.startYear,
          idBnum: r.result.idBnum,
          uri: r.result['@id'].split(':')[1]
        })
      }
    })
    cb(results)
  })
  .catch(function (response) {
    console.log(response)
  })
}

export function agentImagesOf (id, cb) {
  apiHistoryPush(`Images of Agent: '${id}'`, `${API_URL}agents/?action=imagesof&value=${id}`)

  axios.get(API_URL + 'agents', {
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
export function resourceByOwi (id, cb) {
  apiHistoryPush(`OWI Search: '${id}'`, `${API_URL}resources/?action=byowi&value=${id}`)

  axios.get(API_URL + 'resources', {
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

export function resourceOverview (id, cb) {
  apiHistoryPush(`Overview for resource: '${id}'`, `${API_URL}resources/?action=overview&value=${id}`)

  axios.get(API_URL + 'resources', {
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

function _arrayBufferToBase64 (buffer) {
  var binary = ''
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

export function downloadCover (idBnum, cb) {
  // apiHistoryPush(`Overview for resource: '${id}'`, `${API_URL}resources/?action=overview&value=${id}`)

  console.log(`http://s3.amazonaws.com/data.nypl.org/bookcovers/${idBnum}.jpg`)

  axios.get(`http://s3.amazonaws.com/data.nypl.org/bookcovers/${idBnum}.jpg`, {
    responseType: 'arraybuffer'
  })
  .then(function (response) {
    cb(null, _arrayBufferToBase64(response.data))
  })
  .catch(function (response) {
    console.log(`http://s3.amazonaws.com/data.nypl.org/bookcovers/${idBnum}_ol.jpg`)
    // try the OL version
    axios.get(`http://s3.amazonaws.com/data.nypl.org/bookcovers/${idBnum}_ol.jpg`, {
      responseType: 'arraybuffer'
    })
    .then(function (response) {
      if (response.status === 403) {
        cb(true, false)
      } else {
        cb(null, _arrayBufferToBase64(response.data))
      }
    })
    .catch(function (response) {
      cb(true, false)
    })
  })
}

export function merge_options (obj1, obj2) {
  var obj3 = {}
  for (var _a1 in obj1) obj3[_a1] = obj1[_a1]
  for (var _a2 in obj2) obj3[_a2] = obj2[_a2]
  return obj3
}

