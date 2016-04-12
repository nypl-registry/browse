import React from 'react';
import { Router, Route, Link } from 'react-router'
import { connect } from 'react-redux'

import { randomAgents } from '../../utils.js';


import HeaderNav from '../shared/header_nav.js';
import Hero from '../shared/hero.js';
import AgentsSearchBox from './agentsSearch.js';

const agentsHeroImages = [
  { imageID: "1666387", url:"http://digitalcollections.nypl.org/items/510d47e2-771b-a3d9-e040-e00a18064a99",title:"[View of crowd from above.]"},
  { imageID: "1606011", url:"http://digitalcollections.nypl.org/items/510d47e3-95c9-a3d9-e040-e00a18064a99",title:"Rally crowd #1"},
  { imageID: "1671389", url:"http://digitalcollections.nypl.org/items/5e66b3e8-705c-d471-e040-e00a180654d7",title:"Fairgrounds - Visitors - Crowd in front of Perisphere and sundial"},
  { imageID: "DS_03SCAPB", url:"http://digitalcollections.nypl.org/items/510d47df-796f-a3d9-e040-e00a18064a99",title:"Photographer in a crowd."},
  { imageID: "1680795", url:"http://digitalcollections.nypl.org/items/5e66b3e8-81dd-d471-e040-e00a180654d7",title:"Press Events - News Boys - Crowd"}
]
//  { imageID: "xxx", url:"zzz",title:"yyy"},



const RandomAgents = React.createClass({

  componentDidMount: function() {
    randomAgents(function (result) {
      this.setState({
        randomAgents : result.data
      })
    }.bind(this));
  },

  render() {

    if (this.state){
      var r1 = (this.state.randomAgents) ? this.state.randomAgents.itemListElement[0].result : {}
      var r2 = (this.state.randomAgents) ? this.state.randomAgents.itemListElement[1].result : {}
      var r3 = (this.state.randomAgents) ? this.state.randomAgents.itemListElement[2].result : {}
    }else{
      var r1 = { '@id': ""}
      var r2 = { '@id': ""}
      var r3 = { '@id': ""}
    }




    return (
      <div>
        <RandomAgent data={r1}/>
        <RandomAgent data={r2}/>
        <RandomAgent data={r3}/>

      </div>
    );
  }
});

const RandomAgent = React.createClass({
  render() {
    return (
        <div className="four columns">
          <Link to={`/agents/${this.props.data['@id'].split(":")[1]}`} className="agents-search-examples">
            <div className="agents-search-examples-image" style={{backgroundImage: `url(${this.props.data.depiction})`, backgroundSize: "cover" }} >
            </div>
            <div className="agents-search-examples-label">{this.props.data.prefLabel}<br/></div>
            <div className="agents-search-examples-desc">{this.props.data.description}</div>
          </Link>

        </div>
    );
  }
});

const Agents = React.createClass({


  getInitialState: function(){
      return {
          className: ''
      }
  },
  fadeOut() {
    this.setState({className: 'fadeOutFast'})
  },

  render() {
    return (
      <div className={this.state.className}>

        <HeaderNav title="data.nypl / Agents" link="/"/>
        <Hero image={ agentsHeroImages } textUpper="" textMiddle="Agents" textLower="People, Groups, Corporations"/>

        <div className="container">
          <div className="row">
            <div className="tweleve columns">
              <AgentsSearchBox fadeOut={this.fadeOut} />
            </div>
          </div>
        </div>


        <div className="container">
          <div className="agents-search-examples-header">Examples</div>
          <hr style={{marginTop:10, marginBottom:10}} />
          <div className="row">
              <RandomAgents/>
          </div>
        </div>


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
)(Agents);


