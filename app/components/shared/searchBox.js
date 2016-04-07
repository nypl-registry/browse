/* global clearTimeout setTimeout */
import React from 'react'

const SearchBox = React.createClass({
  getDefaultProps: function () {
    return {
      className: 'agent-search-large',
      delayToAutoSearch: 600 // ms delay to wait before automatically submitting entered query
    }
  },

  propTypes: {
    onSubmit: React.PropTypes.func.isRequired
  },

  handleKeyUp: function (event) {
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      // console.log('Live search: ', this.refs._input.value)
      var q = this.refs._input.value
      if (q) this.props.onSubmit({ q: q })
    }, this.props.delayToAutoSearch)
  },

  handleSubmit: function (event) {
    this.props.onSubmit({ q: event.target[0].value })

    event.preventDefault()
    return false
  },

  render () {
    return (
      <div className='search-box'>
        <form onSubmit={this.handleSubmit}>
          <input
            onKeyUp={this.handleKeyUp}
            autoFocus='autofocus'
            className={this.props.className}
            placeholder='Search'
            type='search'
            ref='_input'
          />
          <button className='btn-large btn-search' style={{position: 'absolute', bottom: '20px'}}>
            <span className='visuallyHidden'>(Label)</span>
          </button>
        </form>
      </div>
    )
  }
})

export default SearchBox
