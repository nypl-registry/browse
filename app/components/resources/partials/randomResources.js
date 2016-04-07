import React from 'react'
// import Resource from '../../../models/resource.js'

import RandomRecords from '../../shared/randomRecords.js'

const RandomResources = React.createClass({
  render () {
    return <RandomRecords recordType='resource' items={this.props.items} onFetch={this.props.onFetch} />
  }
})
export default RandomResources
