import React from 'react'
import { connect } from 'react-redux'

import SearchBox from '../../shared/searchBox.js'

const ResourcesSearchBox = React.createClass({
  render: function () {
    return (
      <SearchBox endpoint='/resources/search/?q=' />
    )
  }
})

function mapStateToProps (state) {
  return {
    whatever: state.counter,
    history: state.history
  }
}

// Which action creators does it want to receive by props?
function mapDispatchToProps (dispatch) {
  return {
    onIncrement: () => dispatch(increment())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourcesSearchBox)

export default ResourcesSearchBox
