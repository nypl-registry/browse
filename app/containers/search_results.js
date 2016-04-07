
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { stringify } from 'qs'

import HeaderNav from '../components/shared/header_nav.js'
import AggregationsNav from '../components/shared/aggregations_nav.js'
import TimelineHistogramNav from '../components/shared/timeline_histogram_nav.js'
import SearchBox from '../components/shared/searchBox.js'
// import SearchForm from '../components/shared/search_form.js'
import FiltersControl from '../components/shared/filters_control.js'
import Pagination from '../components/shared/pagination.js'
import ResourcesSearchResultsItem from '../components/resources/search_result.js'
import Footer from '../components/shared/footer.js'
import LoadingIndicator from '../components/shared/loadingIndicator'

import { fetchResourcesIfNeeded, fetchResourcesAggregationsIfNeeded, transitionTo } from '../actions'

const ResourcesSearchResults = React.createClass({

  propTypes: {
    query: React.PropTypes.object.isRequired,
    items: React.PropTypes.array.isRequired,
    isFetching: React.PropTypes.bool.isRequired,
    lastUpdated: React.PropTypes.number
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  fetch (query) {
    this.props.fetch(query)
    this.props.fetchAggregations(query)
  },

  componentDidMount () {
    const { location } = this.props
    this.fetch(location.query)
  },

  componentWillReceiveProps (nextProps) {
    const { location: loc } = nextProps
    this.fetch(loc.query)
  },

  search (query) {
    this.context.router.push(['/resources/search', '?', stringify(query)].join(''))
  },

  renderAggregationsNav () {
    if (this.props.isFetchingAggregations) {
      return <LoadingIndicator message='Loading aggregations' />
    } else if (this.props.aggregationsQuery) {
      return <AggregationsNav aggregations={this.props.aggregations} basePath={this.props.route.path} baseQuery={this.props.aggregationsQuery} />
    }
  },

  renderTimelineNav () {
    if (this.props.aggregations && this.props.aggregations.filter((agg) => agg.field === 'dates').length > 0) {
      return <TimelineHistogramNav aggregations={this.props.aggregations} basePath={this.props.route.path} baseQuery={this.props.aggregationsQuery} />
    }
  },

  renderPagination () {
    if (this.props.total) {
      return <Pagination total={this.props.total} query={this.props.query} basePath={this.props.route.path} />
    }
  },

  renderFilterControls () {
    if (this.props.query && this.props.query.filters && this.props.route) {
      return <FiltersControl query={this.props.query} basePath={this.props.route.path} />
    }
  },

  renderResults () {
    if (this.props.isFetching) {
      return <LoadingIndicator message='Loading results' />
    } else {
      return this.props.items.map((res, i) => <ResourcesSearchResultsItem key={i} rowIndex={i} resource={res} />)
    }
  },

  render () {
    let q = '' || (this.props.location.query.q) ? this.props.location.query.q : ''

    return (
      <div className='search-results'>
        <HeaderNav title='data.nypl / Resources / Search' link='/resources' />
        <div className='container'>
          <div className='row'>
            <div className='twelve columns'>
              <SearchBox className='agents-search-small' onSubmit={this.search} q={q} />
              {this.renderPagination()}
              {this.renderFilterControls()}
              {this.renderTimelineNav()}
            </div>
          </div>
        </div>
        <div className='container'>
          <div className='row'>
            <div className='four columns'>
              {this.renderAggregationsNav()}
            </div>
            <div className='eight columns'>
              {this.renderResults()}
            </div>
          </div>
        </div>
        <Footer />
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
    isFetchingAggregations,
    lastUpdated,
    items,
    total,
    aggregations
  } = resources || {
    query: {},
    isFetching: true,
    isFetchingAggregations: true,
    lastUpdated: null,
    items: [],
    total: null,
    aggregationsQuery: {},
    aggregations: []
  }

  return {
    query,
    items,
    total,
    isFetching,
    isFetchingAggregations,
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
