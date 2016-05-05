import React from 'react'

import AggregationsNav from './aggregationsNav'
import TimelineHistogramNav from './timelineHistogramNav'
import SearchBox from './searchBox'
import FiltersControl from './filtersControl'
import Pagination from './pagination'
import LoadingIndicator from './loadingIndicator'

const SearchResults = React.createClass({

  propTypes () {
    return {
      query: React.PropTypes.object.isRequired,
      resultComponent: React.PropTypes.component.isRequired
    }
  },

  renderAggregationsNav () {
    if (this.props.aggregationsQuery && this.props.aggregationsQuery.isFetching) {
      return <LoadingIndicator message='Loading results' />
    } else if (this.props.aggregationsQuery && this.props.aggregationsQuery.aggregations && this.props.aggregationsQuery.aggregations.filter((agg) => agg.field === 'dates').length > 0) {
      return <AggregationsNav aggregations={this.props.aggregationsQuery.aggregations} basePath={this.props.basePath} baseQuery={this.props.aggregationsQuery.query} />
    }
  },

  renderTimelineNav () {
    if (this.props.aggregationsQuery && !this.props.aggregationsQuery.isFetching && this.props.aggregationsQuery.aggregations && this.props.aggregationsQuery.aggregations.filter((agg) => agg.field === 'dates').length > 0) {
      return <TimelineHistogramNav aggregations={this.props.aggregationsQuery.aggregations} basePath={this.props.basePath} baseQuery={this.props.aggregationsQuery.query} />
    }
  },

  renderPagination () {
    if (this.props.query) {
      return <Pagination total={this.props.total} query={this.props.query} basePath={this.props.basePath} resultType={this.props.resultType} />
    }
  },

  renderFilterControls () {
    if (this.props.query && this.props.query.query && this.props.query.query.filters && this.props.basePath) {
      return <FiltersControl query={this.props.query.query} basePath={this.props.basePath} />
    }
  },

  renderResults () {
    if (this.props.query.isFetching) {
      return <LoadingIndicator message='Loading results' />
    } else if (this.props.query && this.props.query.items) {
      return this.props.query.items.map((res, i) => <this.props.resultComponent key={i} rowIndex={i} result={res} />)
    }
  },

  render () {
    var currentQuery = this.props.query ? this.props.query.query : {}
    return (
      <div>
        <div className='container'>
          <div className='row'>
            <div className='twelve columns'>
              <SearchBox className='agents-search-small' onSubmit={this.props.onSubmit} query={currentQuery} />
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
      </div>
    )
  }
})

export default SearchResults
