import React from 'react'
import { Link } from 'react-router'

const AgentPageResourcesItem = React.createClass({
  getInitialState: function (event) {
    return {errored: false}
  },

  handleError: function (event) {
    this.setState({errored: true})
  },

  render () {
    var displayImg = <td />
    if (!this.state.errored) {
      displayImg = (
        <td className='agent-resources-list-item-bookcover'>
          <img onError={this.handleError} src={`http://s3.amazonaws.com/data.nypl.org/bookcovers/${this.props.data.idBnum}_ol.jpg`} />
        </td>
      )
    }

    return (
      <tr className='agent-resources-list-item-row'>
        <td>
          {this.props.data.startYear}
        </td>
        {displayImg}
        <td className='agent-resources-list-item-title'>
          <Link className='agent-resources-list-item-title-link' to={`/resources/${this.props.data.uri}`}>
            <div>
              {this.props.data.title}
            </div>
          </Link>
        </td>
        <td>
          <Link className='agent-resources-list-item-title-link' to={`/resources/${this.props.data.uri}`}>
            <span className='lg-icon nypl-icon-wedge-right'></span>
          </Link>
        </td>
      </tr>
    )
  }
})

export default AgentPageResourcesItem
