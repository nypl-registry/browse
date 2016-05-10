
import React from 'react'
// import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { randomColorFor } from '../../utils.js'
// import Resource from '../../models/resource.js'

import HeaderNav from '../shared/header_nav.js'
import AggregationsNav from '../shared/aggregations_nav.js'

import { fetchResourcesIfNeeded, fetchResourcesAggregationsIfNeeded, transitionTo } from '../../actions'
import qs from 'qs'

var rowColor = 'white'

const ResourcesSearchResultsItem = React.createClass({

  propTypes () {
    return {
      resource: React.PropTypes.object.isRequired
    }
  },

  render () {
    // console.log('render resource: ', this.props.resource)
    var image = {position: 'relative'}
    var styleLionColor = { color: randomColorFor(this.props.resource.uri) }
    if (this.props.resource.depiction) {
      image = { background: 'url(' + this.props.resource.depiction + ')', position: 'relative' }
      styleLionColor = { display: 'none' }
    }

    var rowColorStyle = (rowColor === 'white') ? { background: 'whitesmoke' } : { background: 'white' }
    rowColor = rowColorStyle.background

    var resourcesNoun = (this.props.resource.useCount === 1) ? 'resource' : 'resources'
    var resourcesStatement = this.props.resource.useCount ? <span>{this.props.resource.useCount} {resourcesNoun}</span> : null

    var contributorStatement = '' // this.props.resource.contributorLabels.join(', ') // map((c) => <span>{c}</span>)

    var desc = <div>{contributorStatement}<br />{resourcesStatement}</div>

    var title = this.props.resource.prefLabel

    var dates = []
    if (this.props.resource.dateStartString) dates.push(this.props.resource.dateStartString)
    if (this.props.resource.dateEndString) dates.push(this.props.resource.dateEndString)
    dates = dates.length > 0 ? <span className='resource-title-dates'>{dates.map((d, ind) => <span key={ind}>{d}</span>)}</span> : null

    return (
      <Link className='agent-listing-item-link' to={this.props.resource.localUrl} key={this.props.resource.id}>
        <div className='row agent-listing-item' style={rowColorStyle}>
          <div className='three columns agent-listing-image' style={image}>
            <span style={styleLionColor} className='lg-icon nypl-icon-logo-mark agent-listing-image-placeholder'></span>
          </div>
          <div className='five columns'>
            <div className='agent-listing-title'>
              {title} {dates}
            </div>
            <div className='agent-listing-desc'>
              {desc}
            </div>
          </div>
          <div className='four columns agent-listing-terms-aligner'>
            <div className='agent-listing-terms'>
              {this.props.resource.termLabels.map((l, ind) => <span key={ind}>{l}<br/></span>)}
            </div>
          </div>
        </div>
      </Link>
    )
  }
})

// class ResourcesSearchResults extends Component {
const ResourcesSearchResults = React.createClass({

  propTypes: {
    query: React.PropTypes.object.isRequired,
    items: React.PropTypes.array.isRequired,
    isFetching: React.PropTypes.bool.isRequired,
    lastUpdated: React.PropTypes.number
  },

  getInitialState: function () {
    return {
      enteredKeyword: this.props.location.query.q
    }
  },

  fetch (query) {
    console.log('Fetch: ', query)
    this.props.fetch(query)
    this.props.fetchAggregations(query)
  },

  componentDidMount () {
    const { location } = this.props
    this.fetch(location.query)
  },

  componentWillReceiveProps (nextProps) {
    console.log('receive props.. diff? ', qs.stringify(nextProps.query), qs.stringify(this.props.query))
    // if (qs.stringify(nextProps.query) !== qs.stringify(this.props.query)) {
    const { location: loc } = nextProps
    this.fetch(loc.query)
  },

  handleKeyUp: function (event) {
    // if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode === 13 || event.keyCode === 8 || event.keyCode === 46) {
    if (event.keyCode === 13) {
      console.log('navigating to ', event.target.value)
      this.props.transitionTo('/resources/search', {q: event.target.value})
    }
  },

  onKeywordChange: function (e) {
    this.setState({ enteredKeyword: e.target.value })
  },

  render () {
    // console.log('search resutls render: ', this.props)

    let q = '' || (this.props.location.query.q) ? this.props.location.query.q : ''
    var aggregationsNav = this.props.aggregations ? <AggregationsNav aggregations={this.props.aggregations} basePath={this.props.route.path} baseQuery={this.props.aggregationsQuery} /> : null

    return (
      <div style={{position: 'relative'}}>
        <HeaderNav title='data.nypl / Resources / Search' link='/resources' />
        <div className='container'>
          <div className='row'>
            <div className='six columns'>
              <input
                ref={(c) => { this._input = c }}
                type='text'
                className='agents-search-small'
                onKeyUp={this.handleKeyUp}
                onChange={this.onKeywordChange}
                onFocus={this.handleFocus}
                autoFocus='autofocus'
                defaultValue={q}
                placeholder='Search'
                autofocus='autofocus'
                value={this.state.enteredKeyword} />
            </div>
          </div>
        </div>
        <div className='container'>
          <div className='row'>
            <div className='three columns'>
              {aggregationsNav}
            </div>
            <div className='nine columns'>
              {this.props.items.map((res, i) => <ResourcesSearchResultsItem key={i} resource={res} />)}
            </div>
          </div>
        </div>
      </div>

    )
  }
})

function mapStateToProps (state) {
  const { resources, router } = state
  const {
    query,
    aggregationsQuery,
    isFetching,
    lastUpdated,
    items,
    aggregations
  } = resources || {
    query: {},
    isFetching: true,
    lastUpdated: null,
    items: [],
    aggregationsQuery: {},
    aggregations: []
  }

  return {
    query,
    items,
    isFetching,
    aggregationsQuery,
    aggregations,
    lastUpdated,
    router
  }
}

function mapDispatchToProps (dispatch, props) {
  return bindActionCreators({ fetch: fetchResourcesIfNeeded, fetchAggregations: fetchResourcesAggregationsIfNeeded, transitionTo }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourcesSearchResults)
