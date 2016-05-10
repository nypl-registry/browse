import React from 'react'

import { agentImagesOf } from '../../utils.js'

const AgentImagesOf = React.createClass({
  componentDidMount: function () {
    agentImagesOf(this.props.agentUri, (results) => {
      if (this.isMounted()) this.setState({imagesOf: results.data})
    })
  },

  render () {
    if (!this.state) {
      return (
        <div />
      )
    } else {
      var imagesOfAry = []

      if (this.state.imagesOf.itemListElement) {
        if (this.state.imagesOf.itemListElement.length > 0) {
          imagesOfAry.push(<div key='agent-images-of-title' className='agent-images-of-title'>
            <br/>Images of Agent:
          </div>)
        }

        this.state.imagesOf.itemListElement.forEach((image, ind) => {
          image.result.filename.forEach((i) => {
            imagesOfAry.push(<a key={`${ind}-${i}`} href={`http://digitalcollections.nypl.org/items/${image.result.uuid.split('uuid:')[1]}`}><img src={`http://images.nypl.org/index.php?t=t&id=${i}`} /></a>)
          })
        })
      }
      return (
        <div className='agent-images-of'>
          {imagesOfAry}
        </div>
      )
    }
  }
})

export default AgentImagesOf
