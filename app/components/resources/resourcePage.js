
import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { resourceOverview, resourceByOwi } from '../../utils.js'
require('core-js/fn/object/entries')

import HeaderNav from '../shared/header_nav.js'
import Hero from '../shared/hero.js'
import Footer from '../shared/footer.js'

import { fetchResourceIfNeeded } from '../../actions'

const ResourcePage = React.createClass({
  componentDidMount: function () {
    const { dispatch, params } = this.props
    dispatch(fetchResourceIfNeeded(params.id))
    /* var self = this

    resourceOverview(this.props.params.id, function (results) {
      self.setState({data: results.data})
    })
    */
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return true
  },

  componentDidUpdate () {
    ReactDOM.findDOMNode(this).scrollIntoView()
  },

  componentWillReceiveProps: function (nextProps) {
    /* resourceOverview(nextProps.params.id, function (results) {
      this.setState({data: results.data})
    }.bind(this))
    */
  },

  renderEntry (entry) {
    // counter++
    var d = entry
    // console.log('entry: ', entry)
    var key = entry[0]
    var values = entry[1]

    if (key === '@context') return null
    if (!Array.isArray(values)) values = [values]

    entry.push([])
    values.forEach((v) => {
      if (v['@id'] && v['@id'].search('terms:') > -1) {
        v = v['prefLabel']
      }

      if (typeof v === 'object') {
        v['@id'] = v['@id'].replace(':', '/')
        v['@id'] = v['@id'].replace('resourcetypes/', 'http://id.loc.gov/vocabulary/resourceTypes/')
        v['@id'] = v['@id'].replace('language/', 'http://id.loc.gov/vocabulary/languages/')
        v['@id'] = v['@id'].replace('res/', '/resources/')

        if (v.title) v.prefLabel = v.title
        if (!v.filename) v.filename = []

        if (d[0].search('roles:') === -1) {
          if (v.filename.length > 0) {
            v.filename.forEach((c) => {
              d[2].push(<Link to={v['@id']}><img src={`http://images.nypl.org/index.php?t=t&id=${c}`}/></Link>)
            })
          } else {
            if (v['@id'].search('vocabulary/resourceTypes') > -1 || v['@id'].search('vocabulary/languages') > -1) {
              d[2].push(<a href={`${v['@id']}`}>{v.prefLabel}</a>)
            } else {
              d[2].push(<Link to={v['@id']}>{v.prefLabel}</Link>)
            }
          }
        } else {
          d[0] = v.note
          d[2].push(<Link to={v['@id']}>{v.prefLabel}</Link>)
        }
      } else {
        if (d[0] === 'idBnum') {
          if (this.state.data.suppressed) {
            d[2].push(<span key={`link-${v}`}>{v} (SUPPRESSED)</span>)
          } else {
            d[2].push(<a key={`link-${v}`} href={`http://catalog.nypl.org/record=${v}`}>{v}</a>)
          }
        } else if (d[0] === 'idMssColl') {
          d[2].push(<a key={`link-${v}`} href={`http://archives.nypl.org/${v}`}>{v}</a>)
        } else if (d[0] === 'idMss') {
          d[2].push(<a key={`link-${v}`} href={`http://archives.nypl.org/detail/${v}`}>{v}</a>)
        } else if (d[0] === 'idOclc' || d[0] === 'idOclcExact') {
          d[2].push(<a key={`link-${v}`} href={`http://worldcat.org/oclc/${v}`}>{v}</a>)
        } else if (d[0] === 'idOwi') {
          d[2].push(<a key={`link-${v}`} href={`http://classify.oclc.org/classify2/ClassifyDemo?owi=${v}`}>{v}</a>)
          d[2].push(<OWILinks id={this.props.params.id} owi={v} />)
        } else if (d[0] === 'idLccCoarse') {
          d[2].push(<a key={`link-${v}`} href={`http://billi.nypl.org/classmark/${v}`}>{v}</a>)
        } else if (d[0] === 'idMmsDb') {
          if (this.state.data['@type'].indexOf('nypl:Item') > -1) {
            d[2].push(<a key={`link-${v}`} href={`http://metadata.nypl.org/items/show/${v}`}>{v}</a>)
          }
          if (this.state.data['@type'].indexOf('nypl:Collection') > -1) {
            d[2].push(<a key={`link-${v}`} href={`http://metadata.nypl.org/collection/${v}`}>{v}</a>)
          }
        } else {
          d[2].push(<span key={`span-${v.toString()}`}>{v.toString()}<br/><br/></span>)
        }
      }
    })

    return (
      <div key={key} className='resource-item-fields'>
        <div key={key} style={(d[1].length === 0) ? { color: 'lightgrey' } : {}} className='resource-item-fields-label'>{d[0]}</div>

        {d[2].map((v, ind) => { return <div key={`${key}.${ind}`} className='resource-item-fields-value'>{v}</div> })}
      </div>
    )
  },

  render () {
    if (this.props.isFetching) {
      return (
        <div>
          <HeaderNav title='data.nypl / Resources' link='/' />
          <Hero
            image={false}
            textUpper=''
            textMiddle='Loading...'
            textLower='' />
        </div>
      )
    } else {
      // console.log(this.state.data.idBnum[0], '$%^&#$')

      var textMiddle = ''
      var textLower = ''
      var imageUrl = {}
      var textMiddleClass = 'agent-hero-middle-text'
      var textLowerClass = 'agent-hero-lower-text'
      if (this.props.item) {
        // imageUrl = this.state.data.agent.depiction
        textMiddle = this.props.item.title[0]
        imageUrl = false
        imageUrl = (this.props.item && this.props.item.idBnum && this.props.item.idBnum[0]) ? { idBnum: this.props.item.idBnum[0] } : false

        // textLower = <span>{this.state.data.agent.description}</span>
        // if (this.state.data.agent.name) if (this.state.data.agent.topFiveRoles.length>0){
        //   textLower = <span>{this.state.data.agent.description}<br/>{this.state.data.agent.topFiveRoles.join(", ")}</span>
        // }

      // console.log()
      }
      var entries = this.props.item ? Object.entries(this.props.item).map(this.renderEntry) : null

      return (
        <div>
          <HeaderNav title='data.nypl / Resources' link='/' />
          <Hero
            textMiddleClass={textMiddleClass}
            textLowerClass={textLowerClass}
            image={{ url: imageUrl, title: '', link: '' }}
            textUpper=''
            textMiddle={textMiddle}
            textLower={textLower} />
          <div className='container'>
            <div className='row'>
              <div className='three columns'>
                <div>
                </div>
              </div>
              <div className='seven columns'>
                <div>
                  {entries}
                </div>
              </div>
              <div className='two columns resource-data-links'>
                <a href={`/resources/${this.props.params.id}/jsonld`}>JSON-LD</a>
                <br/>
                <br/>
                <a href={`/resources/${this.props.params.id}/nt`}>N-Triples</a>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )
    }
  }
})

const OWILinks = React.createClass({
  componentDidMount: function () {
    var self = this

    if (this.props.owi) {
      resourceByOwi(this.props.owi, function (results) {
        self.setState({data: results.data})
      })
    }
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return true
  },

  componentWillReceiveProps: function (nextProps) {
    if (this.props.owi) {
      resourceByOwi(nextProps.owi, function (results) {
        this.setState({data: results.data})
      }.bind(this))
    }
  },

  render () {
    var id = this.props.id
    var hasRelated = false
    var realtedEd = this.state.data.itemListElement.map((owi) => {
      if (parseInt(id) === parseInt(owi.result['@id'].replace('res:', ''))) return <span/>

      if (owi.result && owi.result.dateStart && owi.result.title) {
        hasRelated = true
        return <span key={owi.result['@id']}><Link to={owi.result['@id'].replace('res:', 'resources/')}> ({owi.result.dateStart}) {owi.result.title} </Link><br/></span>
      } else if (owi.result && owi.result.title) {
        hasRelated = true
        return <span key={owi.result['@id']}><Link to={owi.result['@id'].replace('res:', 'resources/')}> {owi.result.title} </Link><br/></span>
      } else {
        return <span key={owi.result['@id']} />
      }
    })

    if (hasRelated) {
      return (
        <div className='resource-owi-box'>
          <span>Related Editions:</span>
          <br/>
          {realtedEd}
        </div>
      )
    } else {
      return (
        <span/>
      )
    }
  }
})

function mapStateToProps (state) {
  const { resource } = state
  const {
    uri,
    isFetching,
    item
  } = resource || {
    isFetching: true,
    item: null
  }

  return {
    uri,
    item,
    isFetching
  }
}

export default connect(mapStateToProps)(ResourcePage)
