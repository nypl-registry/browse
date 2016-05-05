
import React from 'react'
import { Link } from 'react-router'

import ResourceImage from './resourceImage.js'

const ResourcesSearchResultsItem = React.createClass({

  propTypes () {
    return {
      result: React.PropTypes.object.isRequired
    }
  },

  render () {
    var rowColorStyle = (this.props.rowIndex % 2 === 0) ? { background: 'whitesmoke' } : { background: 'white' }

    var resourcesNoun = (this.props.result.useCount === 1) ? 'resource' : 'resources'
    var resourcesStatement = this.props.result.useCount ? <span>{this.props.result.useCount} {resourcesNoun}</span> : null

    var contributorStatement = '' // this.props.result.contributorLabels.join(', ') // map((c) => <span>{c}</span>)

    var desc = <div>{contributorStatement}<br />{resourcesStatement}</div>

    var title = this.props.result.prefLabel

    var dates = []
    if (this.props.result.dateStartString) dates.push(this.props.result.dateStartString)
    if (this.props.result.dateEndString) dates.push(this.props.result.dateEndString)
    dates = dates.length > 0 ? <span className='resource-title-dates'>{dates.map((d, ind) => <span key={ind}>{d}</span>)}</span> : null

    return (
      <Link className='agent-listing-item-link' to={this.props.result.localUrl} key={this.props.result.id}>
        <div className='row agent-listing-item' style={rowColorStyle}>
          <ResourceImage className='three columns agent-listing-image' resource={this.props.result} />
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
              {this.props.result.termLabels.slice(0, 3).map((l, ind) => <span key={ind}>{l}<br/></span>)}
              {this.props.result.termLabels.length > 3 && '...'}
            </div>
          </div>
        </div>
      </Link>
    )
  }
})

export default ResourcesSearchResultsItem
