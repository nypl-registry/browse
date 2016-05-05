import React from 'react'
import RandomRecords from '../shared/randomRecords.js'

const RandomAgents = React.createClass({
  render () {
    return <RandomRecords recordType='agent' records={this.props.agents} onFetch={this.props.onFetch} />
  }
})
export default RandomAgents
