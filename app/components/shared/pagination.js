import React from 'react'
import { Link } from 'react-router'
import { stringify } from 'qs'

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

  linkToPage (page, text = 'More') {
    var props = Object.assign({}, this.props.query.query, { page })
    var url = this.props.basePath + '?' + stringify(props)
    return <Link to={url}>{text}</Link>
  },

  linkToNextPage () {
    var nextPage = this.props.query.query.page ? parseInt(this.props.query.query.page) + 1 : 2
    return this.linkToPage(nextPage, 'More')
  },

  render () {
    return (
      <div className='pagination'>
        {this.linkToNextPage()}
      </div>
    )
  }
})

export default Pagination
