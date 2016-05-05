import React from 'react'
import { Link } from 'react-router'

import { eachValue, agentResources } from '../../utils.js'

import AgentImagesOf from '../agents/agentImagesOf.js'
import AgentPageResourcesItem from '../agents/agentPageResourcesItem.js'

const AgentPageResources = React.createClass({

  getInitialState () {
    return {
      resourcesGrouped: {}
    }
  },

  componentDidMount () {
    agentResources(this.props.agent.id, (results) => {
      this.setState({ resourcesGrouped: results })
    })
  },

  loadResoucesClick (children, title, e) {
    this.setState({resources: children, resourcesTitle: title})
    e.preventDefault()
  },

  render () {
    if (!this.state.resourcesGrouped) {
      return (
        <div className='container'>
          <div className='row'>
            <div className='six columns'>
              <div>
                Loading Resources
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      var about = this.state.resourcesGrouped.about
      var contributed = this.state.resourcesGrouped.contributed

      // build the menus
      var aboutMenu = []
      var contributedMenu = []
      console.log('about: ', about)
      for (let x in about) {
        aboutMenu.push({ children: about[x], label: x, key: `about-menu-${x.substr(0, 2)}-${about[x].length}`, count: `(${about[x].length})` })
      }
      for (let x in contributed) {
        contributedMenu.push({ children: contributed[x], label: x, key: `contributed-menu-${x.substr(0, 2)}-${contributed[x].length}`, count: `(${contributed[x].length})` })
      }
      if (aboutMenu.length === 0) aboutMenu = [{label: 'None', key: 'about-menu-none', count: ''}]
      if (contributedMenu.length === 0) contributedMenu = [{label: 'None', key: 'contributed-menu-none', count: ''}]
      var resources = (!this.state.resources) ? [] : this.state.resources
      if (resources.length > 0) {
        resources.sort(function (a, b) {
          return parseInt(b.startYear) - parseInt(a.startYear)
        })
      }

      var baseballCard = []
      baseballCard.push(<div key='baseballcard-type'>
        <span key='baseballcard-type' className='agent-resources-card-field-label'>Type:</span>
        {eachValue(this.props.agent['@type'], (r) => {
          return <span key={r} className='agent-resources-card-field-value'>{r}</span>
        })}
      </div>)
      baseballCard.push(<div key='baseballcard-birth'>
        <span key='baseballcard-birth' className='agent-resources-card-field-label'>Birth:</span>
        {eachValue(this.props.agent['birthDate'], (r) => <span key={r} className='agent-resources-card-field-value'>{r}</span>)}
      </div>)
      baseballCard.push(<div key='baseballcard-death'>
        <span key='baseballcard-death' className='agent-resources-card-field-label'>Death:</span>
        {eachValue(this.props.agent['deathDate'], (r) => <span key={r} className='agent-resources-card-field-value'>{r}</span>)}
      </div>)
      baseballCard.push(<div key='baseballcard-viaf'>
        <span key='baseballcard-viaf' className='agent-resources-card-field-label'>VIAF:</span>
        {eachValue(this.props.agent['uriViaf'], (r) => <span key={r} className='agent-resources-card-field-value'><a href={`http://viaf.org/viaf/${r.split(':')[1]}`}>{r.split(':')[1]}</a></span>)}
      </div>)
      baseballCard.push(<div key='baseballcard-lc'>
        <span key='baseballcard-lc' className='agent-resources-card-field-label'>LC:</span>
        {eachValue(this.props.agent['uriLc'], (r) => <span key={r} className='agent-resources-card-field-value'><a href={`http://id.loc.gov/authorities/names/${r.split(':')[1]}`}>{r.split(':')[1]}</a></span>)}
      </div>)
      baseballCard.push(<div key='baseballcard-wikidata'>
        <span key='baseballcard-wikidata' className='agent-resources-card-field-label'>Wikidata:</span>
        {eachValue(this.props.agent['uriWikidata'], (r) => <span key={r} className='agent-resources-card-field-value'><a href={`https://www.wikidata.org/wiki/${r.split(':')[1]}`}>{r.split(':')[1]}</a></span>)}
      </div>)
      baseballCard.push(<div key='baseballcard-dbpedia'>
        <span key='baseballcard-dbpedia' className='agent-resources-card-field-label'>DBpedia:</span>
        {eachValue(this.props.agent['uriDbpedia'], (r) => <span key={r} className='agent-resources-card-field-value'><a href={`http://dbpedia.org/resource/${r.split(':')[1]}`}>{r.split(':')[1]}</a></span>)}
      </div>)
      baseballCard.push(<div key='baseballcard-wikipedia'>
        <span key='baseballcard-wikipedia' className='agent-resources-card-field-label'>Wikipedia:</span>
        {eachValue(this.props.agent['wikipedia'], (r) => <span key={r} className='agent-resources-card-field-value'><a href={`http://wikipedia.org/wiki/${r.split(':')[1]}`}>{r.split(':')[1]}</a></span>)}
      </div>)
      baseballCard.push(<div key='baseballcard-top5terms'>
        <span key='baseballcard-top5terms' className='agent-resources-card-field-label'>Top 5 Terms:</span>
        <ul>
          {this.props.agent.topFiveTermsString.map((r) => {
            return (
              <li key={r} className='agent-resources-card-field-value'>
              {r}
              </li>
            )
          })}
        </ul>
      </div>)

      return (

        <div className='container'>
          <div className='row'>
            <div className='three columns'>
              <div className='agent-resources-menu'>
                <div className='agent-resources-menu-top-level'>
                  Resources Created By
                </div>
                {contributedMenu.map((t) => {
                  if (t.label === 'None') {
                    return (
                      <span style={{color: 'inherit'}} key={t.key} className='agent-resources-menu-child'>{t.label}</span>
                    )
                  } else {
                    return (
                      <Link
                        to='./#click'
                        onClick={this.loadResoucesClick.bind(this, t.children, `${t.label} resources contributed to by agent:`)}
                        key={t.key}
                        className='agent-resources-menu-child'>
                        {t.label}
                        {t.count}
                      </Link>
                     )
                  }
                })}
                <br/>
                <div className='agent-resources-menu-top-level'>
                  Resources About
                </div>
                {aboutMenu.map((t) => {
                  if (t.label === 'None') {
                    return (
                      <span style={{color: 'inherit'}} key={t.key} className='agent-resources-menu-child'>{t.label}</span>
                     )
                  } else {
                    return (
                      <Link
                        to='./#click'
                        onClick={this.loadResoucesClick.bind(this, t.children, `${t.label} resources about this agent:`)}
                        key={t.key}
                        className='agent-resources-menu-child'>
                        {t.label}
                        {t.count}
                      </Link>
                     )
                  }
                })}
              </div>
              <div key='agent-baseball-card' className='agent-baseball-card'>
                {baseballCard}
              </div>
            </div>
            <div className='nine columns'>
              <div className='agent-resources-list'>
                <div className='agent-resources-list-title'>
                  {this.state.resourcesTitle}
                </div>
                <table>
                  <tbody>
                    {resources.map((r) => {
                      return <AgentPageResourcesItem data={r} key={r.uri} />
                    })}
                  </tbody>
                </table>
              </div>
              <div>
                <AgentImagesOf key={`images-of-${this.props.agent['@id'].split(':')[1]}`} agentUri={this.props.agent['@id'].split(':')[1]} />
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
})

export default AgentPageResources
