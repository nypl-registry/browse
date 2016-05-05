import React from 'react'
import { Link } from 'react-router'

import AgentImage from './agentImage.js'

const AgentsSearchResultsItem = React.createClass({

  propTypes () {
    return {
      result: React.PropTypes.object.isRequired
    }
  },

  render () {
    var resourcesNoun = (this.props.result.useCount === 1) ? 'resource' : 'resources'
    var desc = <span>{this.props.result.useCount} {resourcesNoun}</span>

    if (this.props.result.topFiveRolesString.length > 0) desc = <span>{this.props.result.topFiveRolesString.join(', ')} ({this.props.result.useCount} resources)</span>
    if (this.props.result.description && this.props.result.topFiveRolesString.length > 0) desc = <span>{this.props.result.description}<br/>{this.props.result.topFiveRolesString.join(', ')} ({this.props.result.useCount} resources)</span>

    var topFiveTermsString = []
    this.props.result.topFiveTermsString.forEach((t) => { topFiveTermsString.push(<span key={`top-five-id-${topFiveTermsString.length}`}>{t}<br/></span>) })

    var rowColorStyle = (this.props.rowIndex % 2 === 0) ? { background: 'whitesmoke' } : { background: 'white' }

    var label = this.props.result.prefLabel

    var dates = []
    if (this.props.result.dateStartString) dates.push(this.props.result.dateStartString)
    if (this.props.result.dateEndString) dates.push(this.props.result.dateEndString)
    dates = dates.length > 0 ? <span className='agent-title-dates'>{dates.map((d, ind) => <span key={ind}>{d}</span>)}</span> : null

    return (
      <Link className='agent-listing-item-link' to={this.props.result.localUrl} key={this.props.result.id}>
        <div className='row agent-listing-item' style={rowColorStyle}>
          <AgentImage className='three columns agent-listing-image' agent={this.props.result} />
          <div className='five columns'>
            <div className='agent-listing-title'>
              {label} {dates}
            </div>
            <div className='agent-listing-desc'>
              {desc}
            </div>
          </div>
          <div className='four columns agent-listing-terms-aligner'>
            <div className='agent-listing-terms'>
              {topFiveTermsString}
            </div>
          </div>
        </div>
      </Link>
    )
  }
})

export default AgentsSearchResultsItem
