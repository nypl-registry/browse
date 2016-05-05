import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { fetchRandomAgents } from '../actions/agents'

import HeaderNav from '../components/shared/headerNav.js'
import Hero from '../components/shared/hero.js'
import SearchBox from '../components/shared/searchBox.js'
import RandomAgents from '../components/agents/randomAgents.js'

const agentsHeroImages = [
  { imageID: '1666387', url: 'http://digitalcollections.nypl.org/items/510d47e2-771b-a3d9-e040-e00a18064a99', title: '[View of crowd from above.]' },
  { imageID: '1606011', url: 'http://digitalcollections.nypl.org/items/510d47e3-95c9-a3d9-e040-e00a18064a99', title: 'Rally crowd #1' },
  { imageID: '1671389', url: 'http://digitalcollections.nypl.org/items/5e66b3e8-705c-d471-e040-e00a180654d7', title: 'Fairgrounds - Visitors - Crowd in front of Perisphere and sundial' },
  { imageID: 'DS_03SCAPB', url: 'http://digitalcollections.nypl.org/items/510d47df-796f-a3d9-e040-e00a18064a99', title: 'Photographer in a crowd.' },
  { imageID: '1680795', url: 'http://digitalcollections.nypl.org/items/5e66b3e8-81dd-d471-e040-e00a180654d7', title: 'Press Events - News Boys - Crowd' }
]

const Agents = React.createClass({
  componentDidMount () {
    this.props.fetchRandoms()
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  search (value) {
    var url = ['/agents/search', '?q=', value.q].join('')
    this.context.router.push(url)
  },

  render () {
    var randoms = this.props.randoms ? <RandomAgents agents={this.props.randoms} onFetch={this.props.fetchRandoms} /> : null

    return (
      <div>
        <HeaderNav title='data.nypl / Agents' link='/' />
        <Hero
          image={agentsHeroImages}
          textUpper=''
          textMiddle='Agents'
          textLower='People, Groups, Corporations' />
        <div className='container'>
          <div className='row'>
            <div className='twelve columns'>
              <SearchBox onSubmit={this.search} />
            </div>
          </div>
        </div>
        {randoms}
      </div>
    )
  }
})

function mapStateToProps (state) {
  const { agents } = state
  const { randoms } = agents || {
    randoms: { isFetching: true }
  }

  return { randoms }
}

function mapDispatchToProps (dispatch, props) {
  return bindActionCreators({ fetchRandoms: fetchRandomAgents }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Agents)
