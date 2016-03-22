/* global increment */

import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { searchResourcesByTitle, randomColor } from '../../utils.js'

import HeaderNav from '../shared/header_nav.js'

var rowColor = 'white'

const ResourcesSearchResultsItem = React.createClass({
  render () {
    var image = {position: 'relative'}
    var styleLionColor = { color: randomColor() }
    if (this.props.data.depiction) {
      image = { background: 'url(' + this.props.data.depiction + ')', position: 'relative' }
      styleLionColor = { display: 'none' }
    }

    var rowColorStyle = (rowColor === 'white') ? { background: 'whitesmoke' } : { background: 'white' }
    rowColor = rowColorStyle.background

    var resourcesNoun = (this.props.data.useCount === 1) ? 'resource' : 'resources'
    var resourcesStatement = this.props.data.useCount ? <span>{this.props.data.useCount} {resourcesNoun}</span> : null

    var contributorStatement = this.props.data.contributorLabels.join(', ') // map((c) => <span>{c}</span>)

    var desc = <div>{contributorStatement}<br />{resourcesStatement}</div>

    var title = this.props.data.prefLabel

    var dates = []
    if (this.props.data.dateStartString) dates.push(this.props.data.dateStartString)
    if (this.props.data.dateEndString) dates.push(this.props.data.dateEndString)
    dates = dates.length > 0 ? <span className='resource-title-dates'>{dates.map((d) => <span>{d}</span>)}</span> : null

    return (
      <Link className='agent-listing-item-link' to={`/resources/${this.props.data['@id'].split(':')[1]}`}>
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
              {this.props.data.termLabels.map((l) => <span key={l}>{l}<br/></span>)}
            </div>
          </div>
        </div>
      </Link>
    )
  }
})

const ResourcesSearchResults = React.createClass({
  getInitialState: function () {
    return {
      results: []
    }
  },

  componentDidMount: function () {
    let q = '' || (this.props.location.query.q) ? this.props.location.query.q : ''
    let self = this

    searchResourcesByTitle(q, function (results) {
      var rAry = []
      results.data.itemListElement.forEach((r) => {
        rAry.push(<ResourcesSearchResultsItem key={r.result['@id']} data={r.result} />)
      })
      self.setState({results: rAry})
    })
    this._input.focus()
    var val = this._input.value
    this._input.value = ''
    this._input.value = val
  },

  handleKeyUp: function (event) {
    if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode === 13 || event.keyCode === 8 || event.keyCode === 46) {
      var self = this
      window.browseHistory.replace('/resources/search/?q=' + event.target.value)

      self.setState({results: []})

      searchResourcesByTitle(event.target.value, function (results) {
        var rAry = []
        results.data.itemListElement.forEach((r) => {
          rAry.push(<ResourcesSearchResultsItem key={r.result['@id']} data={r.result} />)
        })
        self.setState({results: rAry})
      })
    }
  },

  handleFocus: function (event) {
    event.target.value = event.target.value
  },

  render () {
    var results = []
    this.state.results.forEach(function (result) {
      results.push(result)
    })
    let q = '' || (this.props.location.query.q) ? this.props.location.query.q : ''
    return (
      <div style={{position: 'relative'}}>
        <HeaderNav title='data.nypl / Resources / Search' link='/resources' />
        <div className='container'>
          <div className='row'>
            <div className='tweleve columns'>
              <input
                ref={(c) => { this._input = c }}
                type='text'
                className='agents-search-small'
                onKeyUp={this.handleKeyUp}
                onFocus={this.handleFocus}
                autoFocus='autofocus'
                defaultValue={q}
                placeholder='Search'
                autofocus='autofocus' />
            </div>
          </div>
        </div>
        <div className='container'>
          {results}
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
)(ResourcesSearchResults)
