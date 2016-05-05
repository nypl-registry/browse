import React from 'react'
// import { Link } from 'react-router'
import pluralize from 'pluralize'

const Pagination = React.createClass({

  propTypes () {
    return {
      total: React.PropTypes.int.isRequired,
      query: React.PropTypes.object.isRequired,
      basePath: React.PropTypes.string.isRequired,
      resultType: React.PropTypes.string
    }
  },

  getDefaultProps () {
    return {
      resultType: 'result'
    }
  },

  renderCountStatement () {
    if (this.props.total >= 1) {
      return <h3 className='headlines tertiary-heading'>Showing {this.props.total.toLocaleString()} {pluralize(this.props.resultType, this.props.total)}</h3>
    }
  },

  render () {
    return (
      <div className='pagination'>
        {this.renderCountStatement()}
      </div>
    )
  }
})

export default Pagination
