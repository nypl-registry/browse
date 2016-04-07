
import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { resourceByOwi } from '../utils.js'
require('core-js/fn/object/entries')
import { stringify } from 'qs'

import HeaderNav from '../components/shared/header_nav.js'
import Hero from '../components/shared/hero.js'
import Footer from '../components/shared/footer.js'
import ResourceImage from '../components/resources/resourceImage.js'

import { fetchResourceIfNeeded } from '../actions'

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

  renderProperty (heading, value) {
    var el = <p>{value}</p>
    if (!value || value.length === 0) return null

    if (typeof value === 'object') {
      el = <ul>{value.map((v, i) => <li key={i}>{v}</li>)}</ul>
    }
    return <section key={heading}>
      <h3>{heading}</h3>
      {el}
    </section>
  },

  renderIdentifiers () {
    var linked = []
    var unlinked = []

    this.props.item.identifier.forEach((val) => {
      var type = val.split(':')[1]
      var id = val.split(':')[2]
      var filterLink = this.renderFilterLink({ identifier: val }, `Find resources for ${val}`)
      switch (type) {
        case 'bnum':
          linked.push(<span><em>NYPL Catalog</em> <a target='_blank' href={`http://catalog.nypl.org/record=${id}`}>{id}</a> {filterLink}</span>)
          break
        case 'oclc':
          linked.push(<span><em>Worldcat</em> <a target='_blank' href={`http://worldcat.org/oclc/${id}`}>{id}</a> {filterLink}</span>)
          break
        case 'lccc':
          linked.push(<span><em>NYPL B.I.L.L.I.</em> <a target='_blank' href={`http://billi.nypl.org/classmark/${id}`}>{id}</a> {filterLink}</span>)
          break
        case 'owi':
          linked.push(<span><em>OCLC Classification</em> <a target='_blank' href={`http://classify.oclc.org/classify2/ClassifyDemo?owi=${id}`}>{id}</a> {filterLink}</span>)
          break

        default:
          console.log('default render for ', type, id)
          unlinked.push(<span>{val} {filterLink}</span>)
      }
    })

    return (
      <div>
        {this.renderProperty('External Links', linked)}
        {this.renderProperty('Other Identifiers', unlinked)}
      </div>
    )
  },

  renderFilterLink (filters, description) {
    var url = ['/resources/search', '?', stringify({filters: filters})].join('')
    return <Link className='filter-link' to={url} title={description}><span className='nypl-icon-magnifier-circle' /></Link>
  },

  renderContributors () {
    var links = []
    this.props.item.contributor_packed.forEach((pack) => {
      var urn = pack.split('||')[0]
      var uri = urn.split(':')[1]
      var name = pack.split('||')[1]
      var filterLink = this.renderFilterLink({ contributor: urn }, `Find resources for ${name}`)
      links.push(<span><Link to={`/agents/${uri}`}>{name}</Link> {filterLink}</span>)
    })

    return this.renderProperty('Contributors', links)
  },

  renderSubjects () {
    var links = []
    this.props.item.subject_packed.forEach((pack) => {
      var urn = pack.split('||')[0]
      var uri = urn.split(':')[1]
      var name = pack.split('||')[1]
      var filterLink = this.renderFilterLink({ subject: urn }, `Find resources for ${name}`)
      links.push(<span><Link to={`/terms/${uri}`}>{name}</Link> {filterLink}</span>)
    })

    return this.renderProperty('Subjects', links)
  },

  renderBaseballCard () {
    var terms = []

    if (this.props.item.type) {
      terms.push((
        <span>
          <dt>Type</dt>
          <dd>{this.props.item.type} {this.renderFilterLink({ type: this.props.item.type }, 'Find other resources with this type')}</dd>
        </span>
      ))
    }

    if (this.props.item.owner) {
      terms.push((
        <span>
          <dt>Organization</dt>
          <dd>{this.props.item.owner} {this.renderFilterLink({ type: this.props.item.owner }, 'Find other resources by owner')}</dd>
        </span>
      ))
    }

    console.log('calling has dates on ', this.props.item)
    if (this.props.item.hasDates()) {
      terms.push((
        <span>
          <dt>Dates</dt>
          <dd>{this.props.item.datesStatement()} {this.renderFilterLink(this.props.item.dateQuery(), 'Find other resources by owner')}</dd>
        </span>
      ))
    }
    terms.push((
      <span>
        <dt>ID</dt>
        <dd>{this.props.item.id}</dd>
      </span>
    ))

    return (
      <dl>
      {terms}
      </dl>
    )
  },

  renderImage () {
    if (this.props.item && this.props.item.depiction) {
      return <div className='resource-page-image'><img src={this.props.item.depiction} /></div>
    }
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
      var entries = [] // this.props.item ? Object.entries(this.props.item).map(this.renderEntry) : null

      var blocks = []
      if (this.props.item) {
        if (this.props.item.description) blocks.push(<div className='resource-description' key='description'>{this.props.item.description}</div>)
        if (this.props.item.owner || this.props.item.type) blocks.push(this.renderBaseballCard())
        if (this.props.item.contributor_packed) blocks.push(this.renderContributors())
        if (this.props.item.subject_packed) blocks.push(this.renderSubjects())
        if (this.props.item.note) blocks.push(this.renderProperty('Notes', this.props.item.note))
        if (this.props.item.identifier) blocks.push(this.renderIdentifiers())
      }

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
              <div className='seven columns'>
                {blocks}
                <div>
                  {entries}
                </div>
              </div>
              <div className='five columns'>
                {this.renderImage()}
                <div className='resource-data-links'>
                  <a href={`/resources/${this.props.params.id}/jsonld`}>JSON-LD</a>
                  <br/>
                  <br/>
                  <a href={`/resources/${this.props.params.id}/nt`}>N-Triples</a>
                </div>
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
        console.log(results)
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
