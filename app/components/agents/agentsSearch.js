import React from 'react';
import { Router, Route, Link } from 'react-router'
import { connect } from 'react-redux'

const AgentsSearchBox = React.createClass({


  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  componentDidMount: function(){
    //this.getDOMNode().focus()


  },

  handleKeyUp: function(event){

    if (event.target.value.length>3){
      this.context.router.push('/agents/search/?q='+event.target.value)
    }

  },
  handleSubmit: function(event){

    // window.browseHistory.push('/agents/search/?q='+event.target[0].value)
    this.context.router.push('/agents/search/?q='+event.target[0].value)


    event.preventDefault()
    return false

  },
  render() {
    return (
      <div style={{position: "relative", textAlign: "center"}}>

        <form onSubmit={this.handleSubmit}>
          <input
            onKeyUp={this.handleKeyUp}
            autoFocus="autofocus"
            className="agent-search-large"
            placeholder="Search"
            autofocus="autofocus"
            type="search">
          </input>


          <button className="btn-large btn-search" style={{position:"absolute", bottom:"20px"}}>
            <span className="visuallyHidden">(Label)</span>
          </button>
        </form>

      </div>
    );
  }
});


function mapStateToProps(state) {
  return {
    whatever: state.counter,
    history: state.history
  }
}


// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch) {
  return {
    onIncrement: () => dispatch(increment())
  }
}



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AgentsSearchBox);


