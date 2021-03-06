import React from 'react'

import { randomColorFor } from '../../utils.js'
import ImageLoadMixin from '../../lib/imageLoadMixin.js'

const ResourceImage = React.createClass({

  mixins: [ImageLoadMixin],

  propTypes () {
    return {
      resource: React.PropTypes.object.isRequired
    }
  },

  getInitialState () {
    return {
      showPlaceholder: true
    }
  },

  componentDidMount () {
    // If depiction url loads, hide placeholder
    this.loadImage(this.props.resource.depiction, (img) => this.setState({ showPlaceholder: false }))
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
