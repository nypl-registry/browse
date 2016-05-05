// var axios = require('axios')
import fetch from 'isomorphic-fetch'
import { apiHistoryPush } from '../utils.js'

import qs from 'qs'

const API_URL = window.browseAPI

class BaseModel {

  constructor (props = {}) {
    console.log('props: ', props)
    if (props['@id']) {
      var rdfType = (typeof props['@id'] === 'object') ? props['@id'][0] : props['@id']
      this._type = rdfType.split(':')[0]
      this.id = rdfType.split(':')[1]
      console.log('parsed type: ', rdfType)
    }

    ;['uri', 'prefLabel', 'depiction', 'identifier'].forEach((prop) => {
      if (props[prop]) this[prop] = props[prop]
    })
    var pluralType = this._type + (this._type[this._type.length - 1] !== 's' ? 's' : '')
    this.localUrl = `/${pluralType}/${this.id}`
  }

  static aggregations (path, params, cb) {
    var _params = { action: 'aggregations' }
    Object.assign(_params, params)
    return BaseModel.apiSearchQuery(path, _params, cb, function (item) {
      return {
        label: item.label ? item.label : item.field,
        field: item.field,
        values: item.values
      }
    })
  }

  // Assumes given arbitrary api query is a search-style query, returns {results: [...], total: NUM}
  static apiSearchQuery (path, params, cb, castFunction) {
    return BaseModel.apiQuery(path, params, function (data) {
      var results = []
      if (data.itemListElement) {
        results = data.itemListElement.map(castFunction)
      } else {
        results = castFunction(data)
      }
      var total = data.totalResults
      cb({results: results, total: total})
    }, castFunction)
  }

  // Assumes given arbitrary api query is a item-style query, returns single item using castFunc
  static apiItemQuery (path, params, cb, castFunction) {
    return BaseModel.apiQuery(path, params, function (data) {
      cb(castFunction(data))
    }, castFunction)
  }

  // Return entire api response as an object
  static apiQuery (path, params, cb) {
    var queryString = qs.stringify(params)
    fetch([API_URL, path, '?', queryString].join(''))
    .then(function (response) {
      return response.json()
    })
    .then(cb)
    .catch(function (response) {
      console.log(response)
    })

    return {logAs: function (desc) { BaseModel.queryLog(desc, path, params) }}
  }

  static queryLog (desc, path, params) {
    var queryUrl = API_URL + path + '?' + qs.stringify(params)

    apiHistoryPush(desc, queryUrl)
  }
}

export default BaseModel
