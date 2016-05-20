
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { stringify } from 'qs'

import HeaderNav from '../components/shared/headerNav'
import Footer from '../components/shared/footer.js'
import SearchResults from '../components/shared/searchResults.js'
import AgentsSearchResultsItem from '../components/agents/searchResult.js'

import { setAgentsQuery } from '../actions/agents'

const AgentsSearchResults = React.createClass({

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
  },

  search (query) {
    this.context.router.push(['/agents/search', '?', stringify(query)].join(''))
  },

  render () {
    return (
      <div className='search-results'>
        <HeaderNav title='data.nypl / Resources / Search' link='/resources' />
        <SearchResults
          resultComponent={AgentsSearchResultsItem}
          query={this.props.query}
          aggregationsQuery={this.props.aggregationsQuery}
          onSubmit={this.search}
          basePath={this.props.route.path}
          resultType='agent'
        />
        <Footer />
      </div>
    )
  }
})

function mapStateToProps (state) {
  const { agents, router } = state
  const {
    queries,
    aggregationsQueries,
    currentQueryId
  } = agents || {
    queries: {},
    aggregationsQueries: [],
    currentQueryId: null
  }

  var query = null
  var aggregationsQuery = null
  if ((typeof currentQueryId) !== 'undefined') {
    query = queries[currentQueryId]
    aggregationsQuery = aggregationsQueries[currentQueryId]
  }

  return {
    query,
    aggregationsQuery,
    router
  }
}

function mapDispatchToProps (dispatch, props) {
  return bindActionCreators({ setQuery: setAgentsQuery }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AgentsSearchResults)
