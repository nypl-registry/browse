/* global clearTimeout setTimeout */
import React from 'react'

const SearchBox = React.createClass({
  getDefaultProps: function () {
    return {
      className: 'agent-search-large',
      delayToAutoSearch: 600, // ms delay to wait before automatically submitting entered query
      query: {}
    }
  },

  getInitialState () {
    return {
      userTyping: false,
      enteredValue: this.props.query.q
    }
  },

  componentWillReceiveProps (newProps) {
    // Don't overwrite entered value (with query string value, presumably) if user is acively typing
    if (!this.state.userTyping) {
      this.setState({ enteredValue: newProps.query.q })
    }
  },

  propTypes: {
    onSubmit: React.PropTypes.func.isRequired,
    query: React.PropTypes.object
  },

  handleChange (e) {
    this.setState({ enteredValue: e.target.value })
  },

  handleKeyUp: function (event) {
    this.setState({ userTyping: true })

    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      if (this.refs._input) {
        var q = this.refs._input.value
        if (q) this.props.onSubmit({ q: q })

        // User is no longer typing:
        this.setState({ userTyping: false })
      }
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
            onChange={this.handleChange}
            value={this.state.enteredValue}
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
