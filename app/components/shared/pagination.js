import React from 'react'
// import { Link } from 'react-router'

const Pagination = React.createClass({

  propTypes () {
    return {
      total: React.PropTypes.int.isRequired,
      query: React.PropTypes.object.isRequired,
      basePath: React.PropTypes.string.isRequired
    }
  },

  render () {
    return (
      <div className='pagination'>
        <h3 className='headlines tertiary-heading'>Showing {this.props.total.toLocaleString()} results</h3>
      </div>
    )
  }
})

export default Pagination
