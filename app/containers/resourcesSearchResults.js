
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { stringify } from 'qs'

import WindowTitleMixin from '../lib/windowTitleMixin'
import HeaderNav from '../components/shared/headerNav'
import Footer from '../components/shared/footer.js'
import SearchResults from '../components/shared/searchResults.js'
import ResourcesSearchResultsItem from '../components/resources/searchResult.js'

import { setResourcesQuery } from '../actions/resources'

const ResourcesSearchResults = React.createClass({
  mixins: [WindowTitleMixin],

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  fetch (query) {
    this.props.setQuery(query)
  },

  componentDidMount () {
    const { location } = this.props
    this.fetch(location.query)
  },

  componentWillReceiveProps (nextProps) {
    const { location: loc } = nextProps
    this.fetch(loc.query)

    this.setWindowTitle('Resources Search')
  },

  search (query) {
    this.context.router.push(['/resources/search', '?', stringify(query)].join(''))
  },

  render () {
    return (
      <div className='search-results'>
        <HeaderNav title='data.nypl / Resources / Search' link='/resources' />
        <SearchResults
          resultComponent={ResourcesSearchResultsItem}
          query={this.props.query}
          aggregationsQuery={this.props.aggregationsQuery}
          onSubmit={this.search}
          basePath={this.props.route.path}
          resultType='resource'
        />
        <Footer />
      </div>
    )
  }
})

function mapStateToProps (state) {
  const { resources, router } = state
  const {
    queries,
    aggregationsQueries,
    currentQueryId,
    currentAggregationsQueryId
  } = resources || {
    queries: {},
    aggregationsQueries: {},
    currentQueryId: null,
    currentAggregationsQueryId: null
  }

  var query = null
  var aggregationsQuery = null
  if (currentQueryId) {
    query = queries[currentQueryId]
    aggregationsQuery = aggregationsQueries[currentAggregationsQueryId]
  }

  return {
    query,
    aggregationsQuery,
    router
  }
}

function mapDispatchToProps (dispatch, props) {
  return bindActionCreators({ setQuery: setResourcesQuery }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourcesSearchResults)
