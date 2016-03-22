import React from 'react'
import { Link } from 'react-router'

import LoadingIndicator from '../../shared/loadingIndicator.js'
import { randomResources } from '../../../utils.js'

const RandomResources = React.createClass({

  getInitialState: function () {
    return {
      resources: null
    }
  },

  componentDidMount: function () {
    randomResources((res) => {
      if (res.data.itemListElement) {
        this.setState({ resources: res.data.itemListElement.map((item) => item.result) })
      }
    })
  },

  render () {
    if (!this.state.resources) {
      return <LoadingIndicator message='Loading example resources...' />
    } else {
      return <div>
        {this.state.resources.map((resource) => <RandomResource key={resource['@id']} data={resource} />)}
      </div>
    }
  }
})

const RandomResource = React.createClass({
  render () {
    return (
      <div className='four columns'>
        <Link to={`/resources/${this.props.data['@id'].split(':')[1]}`} className='agents-search-examples'>
          <div className='agents-search-examples-image' style={{ backgroundImage: `url(${this.props.data.depiction})`, backgroundSize: 'cover' }} >
          </div>
          <div className='agents-search-examples-label'>{this.props.data.prefLabel}<br/></div>
          <div className='agents-search-examples-desc'>{this.props.data.description}</div>
        </Link>

      </div>
    )
  }
})

export default RandomResources
