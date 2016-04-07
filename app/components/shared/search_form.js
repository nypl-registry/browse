import React from 'react'

const SearchForm = React.createClass({

  propTypes () {
    return {
      q: React.PropTypes.string,
      onSubmit: React.PropTypes.function
    }
  },

  getInitialState () {
    return {
      enteredKeyword: this.props.q
    }
  },

  onKeywordChange (e) {
    this.setState({ enteredKeyword: e.target.value })
  },

  handleKeyUp (event) {
    // if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode === 13 || event.keyCode === 8 || event.keyCode === 46) {
    if (event.keyCode === 13) {
      this.props.onSubmit({ q: event.target.value })
    }
  },

  render () {
    if (!this.state) return null
    return (
      <input
        ref={(c) => { this._input = c }}
        type='text'
        className='agents-search-small'
        onKeyUp={this.handleKeyUp}
        onChange={this.onKeywordChange}
        defaultValue={this.props.q}
        placeholder='Search'
        autofocus='autofocus'
        value={this.state.enteredKeyword} />
    )
  }
})

export default SearchForm
