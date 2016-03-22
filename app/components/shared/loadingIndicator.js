import React                      from 'react';

const LoadingIndicator = React.createClass({
  getDefaultProps: function() {
    return {
      message: 'Loading ...'
    }
  },
  render() {
    return <div className="loading-indicator">{this.props.message}</div>
  }
})

export default LoadingIndicator
