import React from 'react'

import { randomColorFor } from '../../utils.js'
import ImageLoadMixin from '../../lib/imageLoadMixin.js'

const AgentImage = React.createClass({

  mixins: [ImageLoadMixin],

  propTypes () {
    return {
      agent: React.PropTypes.object.isRequired
    }
  },

  getInitialState () {
    return {
      showPlaceholder: true
    }
  },

  componentDidMount () {
    // If depiction url loads, hide placeholder
    this.loadImage(this.props.agent.depiction, (img) => this.setState({ showPlaceholder: false }))
  },

  render () {
    var style = { position: 'relative', backgroundSize: 'cover' }
    var styleLionColor = { color: randomColorFor(this.props.agent.uri) }
    if (this.props.agent.depiction) {
      style = { background: 'url(' + this.props.agent.depiction + ')', position: 'relative' }
    }

    var placeholderImage = this.state.showPlaceholder ? <span style={styleLionColor} className='lg-icon nypl-icon-logo-mark agent-listing-image-placeholder'></span> : null

    return <div className={this.props.className} style={style}>{placeholderImage}</div>
  }
})

export default AgentImage
