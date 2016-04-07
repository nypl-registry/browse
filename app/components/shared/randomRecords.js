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

  componentDidMount () {
    this.fetchNew()
  },

  fetchNew () {
    this.props.onFetch()

    /*
    this.setState(
      {loading: true},
      this.props.onFetch(this.props.fetchCount, (res) => {
        if (res) {
          this.setState({ loading: false, records: res })
        }
      })
    )
    */
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
    if (this.props.items) {
      return this.props.items.map((record) => this.renderRecordElement(record))
    } else {
      return <LoadingIndicator message='Loading...' />
    }
  },

  render () {
    return (
      <div className='container'>
        <div className='agents-search-examples-header'>
          Examples
          <a className='random-more' onClick={this.fetchNew}>(more)</a>
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
