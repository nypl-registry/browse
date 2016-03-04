import React from 'react';
import { Router, Route, Link } from 'react-router'
import { connect } from 'react-redux'
import { agentOverview, agentResources, returnAgentData, agentImagesOf } from '../../utils.js';


import HeaderNav from '../shared/header_nav.js';
import Hero from '../shared/hero.js';
import Footer from '../shared/footer.js';

const AgentPageResourcesItem = React.createClass({

  getInitialState: function(event) {
    return {errored: false};
  },

  handleError: function(event) {
    this.setState({errored: true});
  },


  render() {

      var displayimg = (!this.state.errored) ? <td className="agent-resources-list-item-bookcover"><img onError={this.handleError} src={`http://s3.amazonaws.com/data.nypl.org/bookcovers/${this.props.data.idBnum}_ol.jpg`}/></td> : <td></td>
      ///style={ {backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: "contain", backgroundImage: `url(http://s3.amazonaws.com/data.nypl.org/bookcovers/${this.props.data.idBnum}_ol.jpg)`}
        return (
          <tr className="agent-resources-list-item-row">
            <td >{this.props.data.startYear}</td>
            {displayimg}
            <td className="agent-resources-list-item-title"><Link className="agent-resources-list-item-title-link" to={`/resources/${this.props.data.uri}`}><div>{this.props.data.title}</div></Link></td>
            <td><Link className="agent-resources-list-item-title-link" to={`/resources/${this.props.data.uri}`}><span className="lg-icon nypl-icon-wedge-right"></span></Link></td>
          </tr>
        )
  }
})



const AgentPageResources = React.createClass({

  componentDidMount: function(){

    var self = this;
    agentResources(this.props.agentUri,function(results){
      self.setState({ data: results})
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
              return parseInt(b.startYear) - parseInt(a.startYear);
          })
        }


        var baseballCard = []
        baseballCard.push(<div key="baseballcard-type"><span key="baseballcard-type" className="agent-resources-card-field-label">Type: </span>{this.props.agentData['@type'].map(r => { return <span key={r} className="agent-resources-card-field-value">{r} </span>})}</div>)
        baseballCard.push(<div key="baseballcard-birth"><span key="baseballcard-birth" className="agent-resources-card-field-label">Birth: </span>{this.props.agentData['birthDate'].map(r => { return <span key={r} className="agent-resources-card-field-value">{r} </span>})}</div>)
        baseballCard.push(<div key="baseballcard-death"><span key="baseballcard-death" className="agent-resources-card-field-label">Death: </span>{this.props.agentData['deathDate'].map(r => { return <span key={r} className="agent-resources-card-field-value">{r} </span>})}</div>)
        baseballCard.push(<div key="baseballcard-viaf"><span key="baseballcard-viaf" className="agent-resources-card-field-label">VIAF: </span>{this.props.agentData['uriViaf'].map(r => { return <span key={r} className="agent-resources-card-field-value"><a href={`http://viaf.org/viaf/${r.split(":")[1]}`}>{r.split(":")[1]}</a> </span>})}</div>)
        baseballCard.push(<div key="baseballcard-lc"><span key="baseballcard-lc" className="agent-resources-card-field-label">LC: </span>{this.props.agentData['uriLc'].map(r => { return <span key={r} className="agent-resources-card-field-value"><a href={`http://id.loc.gov/authorities/names/${r.split(":")[1]}`}>{r.split(":")[1]}</a> </span>})}</div>)
        baseballCard.push(<div key="baseballcard-wikidata"><span key="baseballcard-wikidata" className="agent-resources-card-field-label">Wikidata: </span>{this.props.agentData['uriWikidata'].map(r => { return <span key={r} className="agent-resources-card-field-value"><a href={`https://www.wikidata.org/wiki/${r.split(":")[1]}`}>{r.split(":")[1]}</a> </span>})}</div>)
        baseballCard.push(<div key="baseballcard-dbpedia"><span key="baseballcard-dbpedia" className="agent-resources-card-field-label">DBpedia: </span>{this.props.agentData['uriDbpedia'].map(r => { return <span key={r} className="agent-resources-card-field-value"><a href={`http://dbpedia.org/resource/${r.split(":")[1]}`}>{r.split(":")[1]}</a> </span>})}</div>)
        baseballCard.push(<div key="baseballcard-wikipedia"><span key="baseballcard-wikipedia" className="agent-resources-card-field-label">Wikipedia: </span>{this.props.agentData['wikipedia'].map(r => { return <span key={r} className="agent-resources-card-field-value"><a href={`http://wikipedia.org/wiki/${r.split(":")[1]}`}>{r.split(":")[1]}</a> </span>})}</div>)
        baseballCard.push(<div key="baseballcard-top5terms"><span key="baseballcard-top5terms" className="agent-resources-card-field-label">Top 5 Terms: </span><ul> {this.props.agentData['topFiveTermsString'].map(r => { return <li key={r} className="agent-resources-card-field-value">{r}</li>})}</ul></div>)

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

                <div key="agent-baseball-card" className="agent-baseball-card">
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

                <div><AgentImagesOf key={`images-of-${this.props.agentData['@id'].split(":")[1]}`} agentUri={this.props.agentData['@id'].split(":")[1]} /></div>

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


      var textMiddle = "", textLower = ""
      var imageUrl = {}
      var textMiddleClass = "agent-hero-middle-text"
      var textLowerClass = "agent-hero-lower-text"
      if (this.state.data){

        imageUrl = (this.state.data.depiction[0]) ? this.state.data.depiction[0] : false
        textMiddle = (this.state.data.prefLabel[0]) ? this.state.data.prefLabel[0] : false
        textLower = <span>{this.state.data.description.join(" ")}</span>
        if (this.state.data.prefLabel[0]) if (this.state.data.topFiveRolesString.length>0){
          textLower = <span>{this.state.data.description.join(" ")}<br/>{this.state.data.topFiveRolesString.join(", ")}</span>
        }
      }

      return (
        <div>
          <HeaderNav title="data.nypl / Agents" link="/agents"/>
          <Hero textMiddleClass={textMiddleClass} textLowerClass={textLowerClass} image={{ url: imageUrl, title: "", link:""}} textUpper="" textMiddle={textMiddle} textLower={textLower}/>

          <AgentPageResources key={this.props.params.id} agentData={this.state.data} agentUri={this.props.params.id} />

          <Footer></Footer>
        </div>
      )
    }

  }
});


const AgentImagesOf = React.createClass({
  componentDidMount: function(){
    var self = this
    agentImagesOf(this.props.agentUri,function(results){
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

      if (this.state.imagesOf.itemListElement){

        if (this.state.imagesOf.itemListElement.length>0) imagesOfAry.push(<div key="agent-images-of-title" className="agent-images-of-title"><br/>Images of Agent:</div>)

        this.state.imagesOf.itemListElement.forEach(image=>{
          image.result.filename.forEach(i => {
            imagesOfAry.push(<a key={i} href={`http://digitalcollections.nypl.org/items/${image.result.uuid.split("uuid:")[1]}`}><img src={`http://images.nypl.org/index.php?t=t&id=${i}`}/></a>)
          })
        })
      }
      return (
        <div className="agent-images-of">
        {imagesOfAry}
        </div>
      )
    }
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
)(AgentPage)


