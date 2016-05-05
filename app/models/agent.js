import BaseModel from './base.js'

class Agent extends BaseModel {

  constructor (props = {}) {
    super(props)

    Object.keys(props).forEach((prop) => {
      this[prop] = props[prop]
    })
  }

  static lookup (uri, cb) {
    return super.apiItemQuery(`agents/${uri}`, {}, cb, (res) => new Agent(res)).logAs('Agents Lookup')
  }

  static aggregations (params, cb) {
    return super.aggregations('agents', params, cb).logAs('Agents Aggregates')
  }

  static find (params, cb) {
    var _params = { action: 'search' }
    Object.assign(_params, params)
    Agent.byApiQuery(_params, cb).logAs('Find Agent')
  }

  static random (count, cb) {
    Agent.byApiQuery({ action: 'random', per_page: count }, cb).logAs('Random Agent')
  }

  static byApiQuery (params, cb) {
    return super.apiSearchQuery('agents', params, cb, Agent.fromResult)
  }

  static fromResult (result) {
    return new Agent(result.result)
  }
}

export default Agent
