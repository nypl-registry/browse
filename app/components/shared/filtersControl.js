import React from 'react'
import { Link } from 'react-router'
import { stringify } from 'qs'

const FiltersControl = React.createClass({

  propTypes () {
    return {
    }
  },

  queryStringWithoutFilter (field, value) {
    // copy query & filters:
    var newQuery = Object.assign({}, this.props.query)
    newQuery.filters = Object.assign({}, this.props.query.filters)

    // If filter is an array of values:
    if (typeof newQuery.filters[field] === 'object') {
      // Remove value from array:
      newQuery.filters[field] = newQuery.filters[field].filter((otherValue) => otherValue !== value)
      // Remove field entirely if array empty:
      if (newQuery.filters[field].length === 0) delete newQuery.filters[field]
    } else {
      // Remove field entirely
      delete newQuery.filters[field]
    }

    return newQuery
  },

  render () {
    var links = []
    Object.keys(this.props.query.filters).forEach((field, fieldIndex) => {
      // var query = Object.assign({ filters: {} }, this.props.query)

      var values = []
      if ((typeof this.props.query.filters[field]) === 'object') values = this.props.query.filters[field]
      else values = [this.props.query.filters[field]]

      values.forEach((v, i) => {
        var newQuery = this.queryStringWithoutFilter(field, v)

        var url = [this.props.basePath, '?', stringify(newQuery)].join('')
        links.push(<li key={[fieldIndex, i].join('-')}><Link to={url}><span className='nypl-icon-circle-x'/>{field}: {v}</Link></li>)
      })
    })

    return (
      <ul className='filters-control'>
        {links}
      </ul>
    )
  }
})

export default FiltersControl
