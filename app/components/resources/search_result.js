
import React from 'react'
import { Link } from 'react-router'

import ResourceImage from './resourceImage.js'

const ResourcesSearchResultsItem = React.createClass({

  propTypes () {
    return {
      resource: React.PropTypes.object.isRequired
    }
  },

  render () {
    var rowColorStyle = (this.props.rowIndex % 2 === 0) ? { background: 'whitesmoke' } : { background: 'white' }

    var resourcesNoun = (this.props.resource.useCount === 1) ? 'resource' : 'resources'
    var resourcesStatement = this.props.resource.useCount ? <span>{this.props.resource.useCount} {resourcesNoun}</span> : null

    var contributorStatement = '' // this.props.resource.contributorLabels.join(', ') // map((c) => <span>{c}</span>)

    var desc = <div>{contributorStatement}<br />{resourcesStatement}</div>

    var title = this.props.resource.prefLabel

    var dates = []
    if (this.props.resource.dateStartString) dates.push(this.props.resource.dateStartString)
    if (this.props.resource.dateEndString) dates.push(this.props.resource.dateEndString)
    dates = dates.length > 0 ? <span className='resource-title-dates'>{dates.map((d, ind) => <span key={ind}>{d}</span>)}</span> : null

    return (
      <Link className='agent-listing-item-link' to={this.props.resource.localUrl} key={this.props.resource.id}>
        <div className='row agent-listing-item' style={rowColorStyle}>
          <ResourceImage className='three columns agent-listing-image' resource={this.props.resource} />
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
              {this.props.resource.termLabels.slice(0, 3).map((l, ind) => <span key={ind}>{l}<br/></span>)}
              {this.props.resource.termLabels.length > 3 && '...'}
            </div>
          </div>
        </div>
      </Link>
    )
  }
})

export default ResourcesSearchResultsItem
