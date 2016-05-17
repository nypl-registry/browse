import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { fetchRandomResources } from '../actions/resources'

import WindowTitleMixin from '../lib/windowTitleMixin'
import HeaderNav from '../components/shared/headerNav.js'
import Hero from '../components/shared/hero.js'
import SearchBox from '../components/shared/searchBox.js'
import RandomResources from '../components/resources/randomResources.js'

const resourcesHeroImages = [
  { imageID: '115822', url: 'http://digitalcollections.nypl.org/items/510d47d9-857a-a3d9-e040-e00a18064a99', title: 'Drilled books, Mar. 27, 1913' },
  { imageID: '434212', url: 'http://digitalcollections.nypl.org/items/510d47da-d97e-a3d9-e040-e00a18064a99', title: 'Book truck at 40th street entrance of N.Y.P.L.' }
]

const Resources = React.createClass({
  mixins: [WindowTitleMixin],

  componentDidMount () {
    this.props.fetchRandoms()
    this.setWindowTitle('Resources')
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  search (value) {
    var url = ['/resources/search', '?q=', value.q].join('')
    this.context.router.push(url)
  },

  render () {
    var randoms = this.props.randoms ? <RandomResources resources={this.props.randoms} onFetch={this.props.fetchRandoms} /> : null

    return (
      <div>
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
        {randoms}
      </div>
    )
  }
})

function mapStateToProps (state) {
  const { resources } = state
  const {
    randoms
  } = resources || {
    randoms: { isFetching: true }
  }

  return {
    randoms
  }
}

function mapDispatchToProps (dispatch, props) {
  return bindActionCreators({ fetchRandoms: fetchRandomResources }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Resources)
