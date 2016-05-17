// PB: FIXME why is this not working
// var lex = require('nypl-registry-utils-lexicon')

import BaseModel from './base.js'

class Resource extends BaseModel {

  constructor (props = {}) {
    super(props)

    Object.keys(props).forEach((prop) => {
      this[prop] = props[prop]
    })

    this.related = {}

    this.contributorsWithRoles = this.parseContributorsWithRoles()
  }

  hasRelated (type) {
    return this.related && this.related[type] && this.related[type].length > 0
  }

  getRelated (type) {
    if (!this.related || !this.related[type]) return []
    return this.related[type]
  }

  hasIdentifier (type) {
    return (typeof this.getIdentifier(type)) !== 'undefined'
  }

  getIdentifier (type) {
    var idents = this.identifiers().filter((identifier) => identifier.type === type)
    return idents.length > 0 ? idents[0].id : null
  }

  identifiers () {
    return Object.keys(this).filter((k) => k.match(/^id[A-Z]/)).map((k) => {
      var type = k.replace(/^id/, '').toLowerCase()
      if (type === 'exhib') type = 'exhibition'
      if (type === 'lcccoarse') type = 'lccc'
      var id = this[k]
      return { type, id }
    })

    /* this.identifier.map((val) => {
      var type = val.split(':')[1]
      var id = val.split(':')[2]
      return { type: type, id: id }
    })*/
  }

  resourceType () {
    // console.log('lex: ', resourceTypesLex())
    // if ((typeof this.materialType) === 'object') return resourceTypesLex().labels[this.materialType[0]]
    if ((typeof this.materialType) === 'object') return this.materialType[0].replace(/resourcetypes:/, '')
  }

  rdfType () {
    return this['@type'][0].replace(/nypl:/, '')
  }

  firstTitle () {
    return this.title && this.title.length > 0 ? this.title[0] : '[Untitled]'
  }

  datesStatement () {
    return this.dateRange().join(' - ')
  }

  hasDates () {
    return this.dateStartString || this.dateEndString
  }

  dateQuery () {
    if (this.hasDates()) {
      return { date: this.dateRange() }
    }
  }

  dateRange () {
    var dates = []
    if (this.dateStartString) dates.push(this.dateStartString)
    if (this.dateEndString) dates.push(this.dateEndString)
    return dates
  }

  parseContributorsWithRoles () {
    var contributors = this.contributor && this.contributor.length > 0 ? this.contributor : []
    Object.keys(this).forEach((field) => {
      if (field.match(/roles:\w{3}$/)) {
        var role = field.match(/roles:(\w{3})/)[1]
        this[field].forEach((contrib) => {
          contributors.forEach((_contrib, i) => {
            if (contrib['@id'] === _contrib['@id']) {
              if (!contributors[i].roles) contributors[i].roles = []
              contributors[i].roles.push({ '@id': role, prefLabel: contrib.note })
            }
          })
        })
      }
    })
    return contributors
  }

  static fromStatements (props) {
    var inst = new Resource()
    inst.uri = props.uri
    inst.statements = props
    return inst
  }

  static lookup (uri, cb) {
    return super.apiItemQuery(`resources/${uri}`, {}, cb, (res) => new Resource(res)).logAs('Resource Lookup')
  }

  static aggregations (params, cb) {
    return super.aggregations('resources', params, cb).logAs('Resources Aggregates')
  }

  static find (params, cb) {
    var _params = { action: 'search' }
    Object.assign(_params, params)
    Resource.byApiQuery(_params, cb).logAs('Find Resources')
  }

  static random (count, cb) {
    Resource.byApiQuery({ action: 'random', per_page: count }, cb).logAs('Random Resources')
  }

  static byApiQuery (params, cb) {
    return super.apiSearchQuery('resources', params, cb, Resource.fromResult)
  }

  static fromResult (result) {
    return new Resource(result.result)
  }
}

export default Resource
