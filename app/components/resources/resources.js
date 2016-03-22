/* global increment */
import React from 'react'
// import { Link } from 'react-router'
import { connect } from 'react-redux'

import HeaderNav from '../shared/header_nav.js'
import Hero from '../shared/hero.js'
import ResourcesSearchBox from './partials/resourcesSearch.js'
import RandomResources from './partials/randomResources.js'

const resourcesHeroImages = [
  { imageID: '115822', url: 'http://digitalcollections.nypl.org/items/510d47d9-857a-a3d9-e040-e00a18064a99', title: 'Drilled books, Mar. 27, 1913' },
  { imageID: '434212', url: 'http://digitalcollections.nypl.org/items/510d47da-d97e-a3d9-e040-e00a18064a99', title: 'Book truck at 40th street entrance of N.Y.P.L.' }
]

const Resources = React.createClass({
  getInitialState: function () {
    return {
      className: ''
    }
  },
  fadeOut () {
    this.setState({className: 'fadeOutFast'})
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
              <ResourcesSearchBox fadeOut={this.fadeOut} />
            </div>
          </div>
        </div>
        <div className='container'>
          <div className='agents-search-examples-header'>
            Examples
          </div>
          <hr style={{marginTop: 10, marginBottom: 10}} />
          <div className='row'>
            <RandomResources/>
          </div>
        </div>
      </div>
    )
  }
})

function mapStateToProps (state) {
  return {
    whatever: state.counter,
    history: state.history
  }
}

// Which action creators does it want to receive by props?
function mapDispatchToProps (dispatch) {
  return {
    onIncrement: () => dispatch(increment())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Resources)
