import React from 'react'
import { Link } from 'react-router'

import LoadingIndicator from './loadingIndicator.js'
import ResourceImage from '../resources/resourceImage.js'

const RandomRecords = React.createClass({

  propTypes: {
    fetchCount: React.PropTypes.number
  },

  getDefaultProps () {
    return {
      fetchCount: 3
    }
  },

  getInitialState () {
    return {
      records: null,
      loading: true
    }
  },

  renderRecordElement: function (record) {
    return (
      <div className='four columns' key={record.id}>
        <Link to={record.localUrl} className='agents-search-examples'>
          <ResourceImage className='agents-search-examples-image' resource={record} />
          <div className='agents-search-examples-label'>{record.prefLabel}<br/></div>
          <div className='agents-search-examples-desc'>{record.description}</div>
        </Link>
      </div>
    )
  },

  renderRecords: function () {
    if (this.props.records.isFetching) {
      return <LoadingIndicator message='Loading...' />
    } else {
      return this.props.records.items.map((record) => this.renderRecordElement(record))
    }
  },

  render () {
    return (
      <div className='container'>
        <div className='agents-search-examples-header'>
          Examples
          <a className='random-more' onClick={(e) => this.props.onFetch()}>(more)</a>
        </div>
        <hr style={{marginTop: 10, marginBottom: 10}} />
        <div className='row'>
          {this.renderRecords()}
        </div>
      </div>
    )
  }
})

export default RandomRecords
