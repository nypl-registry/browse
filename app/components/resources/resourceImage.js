/* global Image */

import React from 'react'
import { randomColorFor } from '../../utils.js'

const ResourceImage = React.createClass({

  getInitialState () {
    return {
      showPlaceholder: true
    }
  },

  componentDidMount () {
    // Attempt to load depiction. If it loads, hide placeholder
    var img = new Image()
    img.onload = (e) => {
      this.setState({ showPlaceholder: false })
    }
    img.src = this.props.resource.depiction
  },

  render () {
    var style = { position: 'relative', backgroundSize: 'cover' }
    var styleLionColor = { color: randomColorFor(this.props.resource.uri) }
    if (this.props.resource.depiction) {
      style = { background: 'url(' + this.props.resource.depiction + ')', position: 'relative' }
    }

    var placeholderImage = this.state.showPlaceholder ? <span style={styleLionColor} className='lg-icon nypl-icon-logo-mark agent-listing-image-placeholder'></span> : null

    return <div className={this.props.className} style={style}>{placeholderImage}</div>
  }
})

export default ResourceImage
