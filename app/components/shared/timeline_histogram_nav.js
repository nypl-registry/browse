import React from 'react'

const TimelineHistogramNav = React.createClass({

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

  renderYear (count, year, max) {
    var rel = count / max
    var centuryLabel = year % 100 === 0 ? (<span className='label'>{year}</span>) : ''
    var yearLabel = count > 0 ? (<span className='yearLabel'>{year} ({count})</span>) : ''

    return (
      <li key={year}>
        {yearLabel}
        <span className='bar' style={{height: Math.round(rel * 100) + '%'}}>
          {centuryLabel}
        </span>
      </li>
    )
  },

  render () {
    var aggs = this.props.aggregations.filter((agg) => agg.field === 'dates')[0]
    if (aggs.values.length === 0) return null

    var yearMax = 2020
    var points = []
    for (var year = aggs.values[0].value; year <= Math.min(yearMax, aggs.values[aggs.values.length - 1].value); year += 10) {
      points[year] = 0
    }

    var max = 0
    aggs.values.forEach((value) => {
      max = Math.max(value.count, max)
      if (value.value <= yearMax) points[value.value] = value.count
    })

    return <nav className='timeline-histogram-aggregations'>
      <ul>
        {points.map((count, year) => this.renderYear(count, year, max))}
      </ul>
    </nav>
  }
})

export default TimelineHistogramNav
