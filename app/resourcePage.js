import React from 'react';
import { Router, Route, Link } from 'react-router'
import { connect } from 'react-redux'
import { resourceOverview } from './utils.js';


import HeaderNav from './header_nav.js';
import Hero from './hero.js';


const ResourcePage = React.createClass({

  componentDidMount: function(){
    var self = this


    resourceOverview(this.props.params.id,function(results){
     self.setState({data:results.data})
     console.log(results)

    })


  },

  render() {    
    if (!this.state){
      return (
        <div>        
          <HeaderNav title="data.nypl / Resources" link="/"/>
          <Hero image={false} textUpper="" textMiddle="Loading..." textLower=""/>
        </div>
      )
    }else{

      var textMiddle = "", textLower = ""
      var imageUrl = {}
      var textMiddleClass = "agent-hero-middle-text"
      var textLowerClass = "agent-hero-lower-text"
      if (this.state.data){
        // imageUrl = this.state.data.agent.depiction
        textMiddle = this.state.data.title
        imageUrl = false;
        // textLower = <span>{this.state.data.agent.description}</span>

        // if (this.state.data.agent.name) if (this.state.data.agent.topFiveRoles.length>0){
        //   textLower = <span>{this.state.data.agent.description}<br/>{this.state.data.agent.topFiveRoles.join(", ")}</span>
        // }

        console.log(this.state.data)
      }

      return (
        <div>        
          <HeaderNav title="data.nypl / Resources" link="/"/>
          <Hero textMiddleClass={textMiddleClass} textLowerClass={textLowerClass} image={{ url: imageUrl, title: "", link:""}} textUpper="" textMiddle={textMiddle} textLower={textLower}/>
        

          <div className="container">
            <div className="row">
              <div className="tweleve columns">
                <div>{this.state.data.data.map(d =>{

                    return (
                      <div className="resource-item-fields">
                        <div className="resource-item-fields-label">{d.label}</div>
                        {d.values.map(v => { return <div className="resource-item-fields-value">{v.label} {v.value}</div> })}
                      </div>

                      )

                  })}


                </div>
              </div>
            </div>
          </div>


        </div>
      )      
    }

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
)(ResourcePage);


