import React from 'react'

const LoadingIndicator = React.createClass({
  getDefaultProps () {
    return {
      message: 'Loading ...'
    }
  },

  renderSpinner () {
    return (
      <div className='spinner'>
        <div className='bounce1'></div>
        <div className='bounce2'></div>
        <div className='bounce3'></div>
      </div>
    )
  },

  render () {
    return <div className='loading-indicator'><div>{this.props.message}</div>{this.renderSpinner()}</div>
  }
})

export default LoadingIndicator
