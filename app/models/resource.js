import BaseModel from './base.js'

class Resource extends BaseModel {

  constructor (props = {}) {
    super(props)

    Object.keys(props).forEach((prop) => {
      this[prop] = props[prop]
    })
    /*
    ;['title', 'contributorLabels', 'dateStartString', 'dateEndString', 'termLabels', 'type'].forEach((prop) => {
      if (props[prop]) this[prop] = props[prop]
    })
    */
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
