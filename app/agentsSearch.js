import React from 'react';
import { Router, Route, Link } from 'react-router'
import { connect } from 'react-redux'

const AgentsSearchBox = React.createClass({

  componentDidMount: function(){
    //this.getDOMNode().focus()
  },

  handleKeyUp: function(event){

    if (event.target.value.length>3){

      this.props.fadeOut()
     // setTimeout(function(){
        window.browseHistory.push('/agents/search/'+event.target.value)
     // },400)
    }

  },

  render() {

    return (
      <div style={{position: "relative", textAlign: "center"}}>

        <form>
          <input onKeyUp={this.handleKeyUp} autoFocus="autofocus" className="agent-search-large" placeholder="Search" autofocus="autofocus" type="search"></input>
          <button className="btn-large btn-search">
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


