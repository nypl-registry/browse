import React from 'react';
import { Router, Route, Link } from 'react-router'
import { connect } from 'react-redux'
import { debounce, searchAgentByName, randomColor } from '../../utils.js';

import HeaderNav from '../shared/header_nav.js';

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
    if (this.props.data.topFiveRolesString.length>0) desc = <span>{this.props.data.topFiveRolesString.join(", ")} ({this.props.data.useCount} resources)</span>
    if (this.props.data.description && this.props.data.topFiveRolesString.length>0) desc = <span>{this.props.data.description}<br/>{this.props.data.topFiveRolesString.join(", ")} ({this.props.data.useCount} resources)</span>

    var topFiveTermsString = []
    this.props.data.topFiveTermsString.forEach(t=> { topFiveTermsString.push(<span key={`top-five-id-${topFiveTermsString.length}`}>{t}<br/></span>) })


    return (
      <Link className="agent-listing-item-link" to={`/agents/${this.props.data['@id'].split(":")[1]}`}>
        <div className="row agent-listing-item" style={rowColorStyle}>
          <div className="three columns agent-listing-image" style={image}  >
              <span style={styleLionColor} className="lg-icon nypl-icon-logo-mark agent-listing-image-placeholder"></span>
          </div>
          <div className="five columns">
            <div className="agent-listing-title">{this.props.data.prefLabel}</div>
            <div className="agent-listing-desc">{desc}</div>
          </div>
          <div className="four columns agent-listing-terms-aligner">

            <div className="agent-listing-terms">
              {topFiveTermsString}
            </div>

          </div>

        </div>
      </Link>
    )
  }
})



const AgentsSearchResults = React.createClass({


  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function(){
      return {
          results: []
      }
  },

  componentDidMount: function(){
    let q = "" || (this.props.location.query.q) ? this.props.location.query.q : ""
    let self = this

    searchAgentByName(q,function(results){
      var rAry = []
      results.data.itemListElement.forEach(r =>{
        rAry.push(<AgentsSearchResultsItem key={r.result['@id']} data={r.result}/>)
      })
      self.setState({results:rAry})
    })
    this._input.focus()
    var val = this._input.value
    this._input.value = ''
    this._input.value = val
  },


  handleKeyUp: function(event){

    if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode == 13 || event.keyCode == 8 || event.keyCode == 46  ){

      var self = this;
      //window.browseHistory.replace('/agents/search/?q='+event.target.value)
      this.context.router.push('/agents/search/?q='+event.target.value)

      //this.setSate({ results : this.state.results})

      self.setState({results:[]})

      searchAgentByName(event.target.value,function(results){
        var rAry = []
        results.data.itemListElement.forEach(r =>{
          rAry.push(<AgentsSearchResultsItem key={r.result['@id']} data={r.result}/>)
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
    let q = "" || (this.props.location.query.q) ? this.props.location.query.q : ""
    return (
      <div style={{position: "relative"}}>
        <HeaderNav title="data.nypl / Agents / Search" link="/agents"/>

        <div className="container">
          <div className="row">
            <div className="tweleve columns">
              <input ref={(c) => this._input = c} type="text" className="agents-search-small" onKeyUp={this.handleKeyUp} onFocus={this.handleFocus} autoFocus="autofocus" defaultValue={q} placeholder="Search" autofocus="autofocus"/>
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


