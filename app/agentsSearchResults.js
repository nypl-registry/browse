import React from 'react';
import { Router, Route, Link } from 'react-router'
import { connect } from 'react-redux'
import { debounce, searchAgentByName, randomColor } from './utils.js';

import HeaderNav from './header_nav.js';

var rowColor = "white"

const AgentsSearchResultsItem = React.createClass({

  render() {

    var image = {position:"relative"}
    var styleLionColor = { color: randomColor() }
    if (this.props.data.depiction){
     image = { background: "url("+this.props.data.depiction+")", position:"relative"}
     styleLionColor  = { display: "none"}
    }

    var rowColorStyle = (rowColor==='white') ? { background: "whitesmoke"} : { background: "white"} 
    rowColor = rowColorStyle.background

    var resourcesNoun = (this.props.data.useCount===1) ? "resource" : "resources"
    var desc = <span>{this.props.data.useCount} {resourcesNoun}</span>
    if (this.props.data.topFiveRoles.length>0) desc = <span>{this.props.data.topFiveRoles.join(", ")} ({this.props.data.useCount} resources)</span>
    if (this.props.data.description && this.props.data.topFiveRoles.length>0) desc = <span>{this.props.data.description}<br/>{this.props.data.topFiveRoles.join(", ")} ({this.props.data.useCount} resources)</span>
    
    var topFiveTerms = []
    this.props.data.topFiveTerms.forEach(t=> { topFiveTerms.push(<span key={`top-five-id-${topFiveTerms.length}`}>{t}<br/></span>) })


    return (
      <Link className="agent-listing-item-link" to={`/agents/${this.props.data.uri}`}>
        <div className="row agent-listing-item" style={rowColorStyle}>        
          <div className="three columns agent-listing-image" style={image}  >          
              <span style={styleLionColor} className="lg-icon nypl-icon-logo-mark agent-listing-image-placeholder"></span>
          </div>
          <div className="five columns">
            <div className="agent-listing-title">{this.props.data.label}</div>
            <div className="agent-listing-desc">{desc}</div>
          </div>
          <div className="four columns agent-listing-terms-aligner">

            <div className="agent-listing-terms">
              {topFiveTerms}
            </div>

          </div>

        </div>
      </Link>
    )
  }
})



const AgentsSearchResults = React.createClass({


  getInitialState: function(){
      return {
          results: []
      }
  },

  componentDidMount: function(){
    var self = this;
    searchAgentByName(this.props.params.term,function(results){
      var rAry = []
      results.data.forEach(r =>{
        rAry.push(<AgentsSearchResultsItem key={r.uri} data={r}/>)             
      })
      self.setState({results:rAry})
    })
  },


  handleKeyUp: function(event){

    if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode == 13 || event.keyCode == 8 || event.keyCode == 46  ){

      var self = this;
      window.browseHistory.replace('/agents/search/'+event.target.value)
      //this.setSate({ results : this.state.results})
      
      console.log(event.target.value)
      self.setState({results:[]})
      
      searchAgentByName(event.target.value,function(results){
        var rAry = []
        results.data.forEach(r =>{
          rAry.push(<AgentsSearchResultsItem key={r.uri} data={r}/>)             
        })
        self.setState({results:rAry})
      })
    }

  },
  // componentDidMount: function(){
  //   this.handleKeyUp = debounce(this.handleKeyUp,400)
  // },
  handleFocus: function(event){
    event.target.value = event.target.value
  },
  render() {

    var results = []
    this.state.results.forEach(function(result) {

      results.push(result)

    })


    return (
      <div style={{position: "relative"}}>
        <HeaderNav title="data.nypl / Agents / Search" link="/agents"/>

        <div className="container">
          <div className="row">
            <div className="tweleve columns">
              <input type="text" className="agents-search-small" onKeyUp={this.handleKeyUp} onFocus={this.handleFocus} autoFocus="autofocus" defaultValue={this.props.params.term} placeholder="Search" autofocus="autofocus"/>              
            </div>
          </div>
        </div>

        <div className="container">                      
              {results}
        </div>


      </div>




    )
  }
})




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
)(AgentsSearchResults);


