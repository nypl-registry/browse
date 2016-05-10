import React from 'react'
import { Link } from 'react-router'
import qs from 'qs'

const AggregationsNav = React.createClass({

  propTypes () {
    return {
      baseQuery: React.PropTypes.object.isRequired,
      basePath: React.PropTypes.string.isRequired,
      aggregations: React.PropTypes.array.isRequired
    }
  },

  getDefaultProps () {
    return {
    }
  },

  renderAggregation (aggregation) {
    var values = aggregation.values.map((value) => {
      var query = Object.assign({ filters: {} }, this.props.baseQuery)
      query.filters = Object.assign({}, query.filters)
      query.filters[aggregation.field] = value.value
      value.url = `${this.props.basePath}?${qs.stringify(query)}`
      value.selected = this.props.baseQuery.filters && this.props.baseQuery.filters[aggregation.field] && this.props.baseQuery.filters[aggregation.field].indexOf(value.value) >= 0
      return value
    })
    if (values.length === 0) return null

    return <section className='sub-menu full' key={aggregation.field}>
      <header className='title'>{aggregation.label}</header>
      <ul>
        {values.map((v, i) => <li key={i} className={v.selected ? 'selected' : ''}><Link to={v.url}><span className='nypl-icon-circle-x'/><span className='label'>{v.label ? v.label : v.value}</span> <span className='count'>{v.count.toLocaleString()}</span></Link></li>)}
      </ul>
    </section>
  },

  render () {
    var aggs = this.props.aggregations.filter((agg) => agg.field !== 'dates')
    var order = ['type', 'subject', 'owner', 'contributor']
    aggs = aggs.sort((a1, a2) => {
      if (order.indexOf(a1) < 0) return 1
      if (order.indexOf(a2) < 0) return -1
      if (order.indexOf(a1) < order.indexOf(a2)) return -1
      return 1
    })

    return <nav className='search-results-aggregations'>
      {aggs.map((agg) => this.renderAggregation(agg))}
    </nav>
  }
})

export default AggregationsNav
