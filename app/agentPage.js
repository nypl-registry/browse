import React from 'react';
import { Router, Route, Link } from 'react-router'
import { connect } from 'react-redux'
import { agentOverview, agentResources, returnAgentData, agentImagesOf } from './utils.js';


import HeaderNav from './header_nav.js';
import Hero from './hero.js';


const AgentPageResourcesItem = React.createClass({
  render() {  
        return (
          <tr className="agent-resources-list-item-row">
            <td >{this.props.data.dateStart}</td>
            <td className="agent-resources-list-item-title"><Link className="agent-resources-list-item-title-link" to={`/resources/${this.props.data.uri}`}><div>{this.props.data.title}</div></Link></td>
            <td><Link className="agent-resources-list-item-title-link" to={`/resources/${this.props.data.uri}`}><span className="lg-icon nypl-icon-wedge-right"></span></Link></td>
          </tr>
        )     
  }    
})



const AgentPageResources = React.createClass({

  componentDidMount: function(){
    console.log(this.props,this.props,this.props,this.props)
    var self = this;
    agentResources(this.props.agentUri,function(results){
      self.setState({ data: results.data})
    })
  },
  loadResoucesClick: function(children, title, e){
    this.setState({resources: children, resourcesTitle: title})
    e.preventDefault()
  },


  render() {
      if (!this.state){
        return (
          <div className="container">
            <div className="row">
              <div className="six columns">
                <div>Loading Resources</div>
              </div>
            </div>
          </div>

          )
      }else{

        var about = this.state.data.about
        var contributed = this.state.data.contributed

        //build the menus
        var aboutMenu = [], contributedMenu =[]
        for (var x in about){
          aboutMenu.push({ children: about[x],  label: x, key: `about-menu-${x.substr(0,2)}-${about[x].length}`, count: `(${about[x].length})` })
        }

        for (var x in contributed){
          contributedMenu.push({children: contributed[x], label: x, key: `contributed-menu-${x.substr(0,2)}-${contributed[x].length}`, count: `(${contributed[x].length})` })
        }

        if (aboutMenu.length===0) aboutMenu = [{label:"None", key: "about-menu-none",count:""}]
        if (contributedMenu.length===0) contributedMenu = [{label:"None", key:"contributed-menu-none",count:""}]
        
        var resources = (!this.state.resources) ? [] : this.state.resources

        if (resources.length>0){

   
          resources.sort(function(a, b) {
              return parseInt(b.dateStart) - parseInt(a.dateStart);
          });




        }


        var agentData = returnAgentData(this.props.agentData)
        var baseballCard = []
        if (agentData.rdfType) baseballCard.push(<div><span>Type: {agentData.rdfType}</span></div>) 
        if (agentData.birthDate) baseballCard.push(<div><span>Birth: {agentData.birthDate}</span></div>) 
        if (agentData.deathDate) baseballCard.push(<div><span>Death: {agentData.deathDate}</span></div>) 
        if (agentData.viaf) baseballCard.push(<div><span>VIAF: <a href={`http://viaf.org/viaf/${agentData.viaf}`}>{agentData.viaf}</a></span></div>) 
        if (agentData.wikidata) baseballCard.push(<div><span>Wikidata: <a href={`https://www.wikidata.org/wiki/${agentData.wikidata}`}>{agentData.wikidata}</a></span></div>) 
        if (agentData.lc) baseballCard.push(<div><span>LC: <a href={`http://id.loc.gov/authorities/names/${agentData.lc}`}>{agentData.lc}</a></span></div>) 
        if (agentData.dbpedia) baseballCard.push(<div><span>DBpedia: <a href={`http://dbpedia.org/resource/${agentData.dbpedia}`}>{agentData.dbpedia}</a></span></div>) 
        if (agentData.wikipedia) baseballCard.push(<div><span>Wiki: <a href={`http://wikipedia.org/wiki/${agentData.wikipedia}`}>{agentData.wikipedia}</a></span></div>) 
        if (agentData.topFiveTerms.length>0){
          baseballCard.push(<div>Top Five Terms:</div>)
          agentData.topFiveTerms.forEach(t => baseballCard.push(<div>-{t}</div>))
        }

        return (

          <div className="container">
            <div className="row">
              <div className="three columns">

                <div className="agent-resources-menu">                 
                  <div className="agent-resources-menu-top-level">Resources Created By</div>

                  {contributedMenu.map(t => {
                    if (t.label==="None"){
                      return (
                        <span style={{color:"inherit"}} key={t.key} className="agent-resources-menu-child">{t.label}</span>
                      )
                    }else{
                      return (
                        <Link to="./#click" onClick={this.loadResoucesClick.bind(this, t.children, `${t.label} resources contributed to by agent:`)} key={t.key} className="agent-resources-menu-child">{t.label} {t.count}</Link>
                      )

                    }

                  })}
                  <br/>
                  <div className="agent-resources-menu-top-level">Resources About</div>
                  {aboutMenu.map(t => {
                    if (t.label==="None"){
                      return (
                        <span style={{color:"inherit"}} key={t.key} className="agent-resources-menu-child">{t.label}</span>
                      )
                    }else{
                      return (
                        <Link to="./#click" onClick={this.loadResoucesClick.bind(this, t.children, `${t.label} resources about this agent:`)} key={t.key} className="agent-resources-menu-child">{t.label} {t.count}</Link>
                      )
                    }
                  })}
                </div>

                <div className="agent-resources-card">
                    {baseballCard}

                </div>
              </div>
              <div className="nine columns">
                <div className="agent-resources-list">
                  <div className="agent-resources-list-title">{this.state.resourcesTitle}</div>
                  <table>
                    <tbody>
                  {resources.map(r => {

                    return <AgentPageResourcesItem data={r} key={r.uri} />


                  })}
                    </tbody>
                  </table>
                </div>

                <div><AgentImagesOf key={`images-of-${this.props.agentData.uri}`} agentUri={this.props.agentData.uri} /></div>

              </div>

            </div>
          </div>




        )     
      } 
    }
});








const AgentPage = React.createClass({

  componentDidMount: function(){
    var self = this


    agentOverview(this.props.params.id,function(results){
     self.setState({data:results.data})
     self.render()
    })


  },

  render() {    
    if (!this.state){
      return (
        <div>        
          <HeaderNav title="data.nypl / Agents" link="/"/>
          <Hero image={false} textUpper="" textMiddle="Loading..." textLower=""/>
        </div>
      )
    }else{

      console.log(this.state.data)
      var textMiddle = "", textLower = ""
      var imageUrl = {}
      var textMiddleClass = "agent-hero-middle-text"
      var textLowerClass = "agent-hero-lower-text"
      if (this.state.data){
        imageUrl = this.state.data.agent.depiction
        textMiddle = this.state.data.agent.name
        textLower = <span>{this.state.data.agent.description}</span>

        if (this.state.data.agent.name) if (this.state.data.agent.topFiveRoles.length>0){
          textLower = <span>{this.state.data.agent.description}<br/>{this.state.data.agent.topFiveRoles.join(", ")}</span>
        }

      }

      return (
        <div>        
          <HeaderNav title="data.nypl / Agents" link="/agents"/>
          <Hero textMiddleClass={textMiddleClass} textLowerClass={textLowerClass} image={{ url: imageUrl, title: "", link:""}} textUpper="" textMiddle={textMiddle} textLower={textLower}/>
        
          <AgentPageResources agentData={this.state.data.agent} agentUri={this.props.params.id} />
        </div>
      )      
    }

  }
});


const AgentImagesOf = React.createClass({

  componentDidMount: function(){
    var self = this

    console.log("YEADFHGFDFD")

    agentImagesOf(this.props.agentUri,function(results){
    console.log(results)
     self.setState({imagesOf:results.data})

    })


  },

  render() {    
    if (!this.state){
      return (
        <div>        


        </div>
      )
    }else{

      var imagesOfAry =[]

      if (this.state.imagesOf){

        if (this.state.imagesOf.length>0) imagesOfAry.push(<div className="agent-images-of-title"><br/>Images of Agent:</div>)

        this.state.imagesOf.forEach(image=>{
          console.log(image)

          image.imageId.forEach(i => {
            imagesOfAry.push(<a key={i} href={`http://digitalcollections.nypl.org/items/${image.uuid}`}><img src={`http://images.nypl.org/index.php?t=t&id=${i}`}/></a>)  
          })
          
        })
      }

      console.log()


      return (
        <div className="agent-images-of">        


        {imagesOfAry}

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
)(AgentPage);


