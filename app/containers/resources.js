import React from 'react'
import { bindActionCreators } from 'redux'
// import { Link } from 'react-router'
import { connect } from 'react-redux'

import { fetchRandomResources } from '../actions'

import HeaderNav from '../components/shared/header_nav.js'
import Hero from '../components/shared/hero.js'
import SearchBox from '../components/shared/searchBox.js'
import RandomResources from '../components/resources/partials/randomResources.js'

const resourcesHeroImages = [
  { imageID: '115822', url: 'http://digitalcollections.nypl.org/items/510d47d9-857a-a3d9-e040-e00a18064a99', title: 'Drilled books, Mar. 27, 1913' },
  { imageID: '434212', url: 'http://digitalcollections.nypl.org/items/510d47da-d97e-a3d9-e040-e00a18064a99', title: 'Book truck at 40th street entrance of N.Y.P.L.' }
]

const Resources = React.createClass({
  getInitialState () {
    return {
      className: ''
    }
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  fadeOut () {
    this.setState({className: 'fadeOutFast'})
  },

  search (value) {
    var url = ['/resources/search', '?q=', value].join('')
    this.context.router.push(url)
  },

  render () {
    return (
      <div className={this.state.className}>
        <HeaderNav title='data.nypl / Resources' link='/' />
        <Hero
          image={resourcesHeroImages}
          textUpper=''
          textMiddle='Resources'
          textLower='Stuff & Things' />
        <div className='container'>
          <div className='row'>
            <div className='twelve columns'>
              <SearchBox onSubmit={this.search} />
            </div>
          </div>
        </div>
        <RandomResources items={this.props.items} onFetch={this.props.fetchRandomResources} />
      </div>
    )
  }
})

function mapStateToProps (state) {
  const { randomResources } = state
  const {
    isFetching,
    items
  } = randomResources || {
    isFetching: true,
    items: null
  }

  return {
    items,
    isFetching
  }
}

function mapDispatchToProps (dispatch, props) {
  return bindActionCreators({ fetchRandomResources }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Resources)
