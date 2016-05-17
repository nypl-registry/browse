import React from 'react'
import { bindActionCreators } from 'redux'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import { connect } from 'react-redux'
require('core-js/fn/object/entries')
import { stringify } from 'qs'
import pluralize from 'pluralize'

import { urlFor, eachValue } from '../utils.js'

import HeaderNav from '../components/shared/headerNav'
import Hero from '../components/shared/hero'
import Footer from '../components/shared/footer'
import OWILinks from '../components/resources/owiLinks'
import ImageLoadMixin from '../lib/imageLoadMixin'
import WindowTitleMixin from '../lib/windowTitleMixin'
import LoadingIndicator from '../components/shared/loadingIndicator'

import { setCurrentResourceId, fetchByOwiIfNeeded } from '../actions/resources'

const ResourcePage = React.createClass({

  mixins: [ImageLoadMixin, WindowTitleMixin],

  getDefaultProps (props) {
    // console.log('props: ', props)
    return {}
  },

  getInitialState () {
    return {
      hasDepiction: false
    }
  },

  componentDidMount () {
    const { params } = this.props

    this.props.setCurrentId(parseInt(params.id))

    this.checkDepiction()
  },

  checkDepiction () {
    this.setState({ hasDepiction: false }, () => {
      if (this.item() && this.item().depiction) {
        this.loadImage(this.item().depiction, (img) => this.setState({ hasDepiction: true }))
      }
    })
  },

  componentDidUpdate () {
    ReactDOM.findDOMNode(this).scrollIntoView()
  },

  componentWillReceiveProps (nextProps) {
    const { params } = nextProps

    this.props.setCurrentId(parseInt(params.id))

    if (this.item() && this.item().hasIdentifier('owi')) {
      this.props.fetchByOwi(this.item().getIdentifier('owi'))
    }

    if (nextProps.resource) this.setWindowTitle('Resources', nextProps.resource.firstTitle())

    this.checkDepiction()
  },

  shouldComponentUpdate (nextProps, nextState) {
    return true
  },

  renderProperty (heading, value, className = '') {
    var el = <p>{value}</p>
    if (!value || value.length === 0) return null

    if (typeof value === 'object') {
      el = <ul>{value.map((v, i) => <li key={i}>{v}</li>)}</ul>
    }
    return <section key={heading} className={className}>
      <h3>{heading}</h3>
      {el}
    </section>
  },

  renderIdentifiers () {
    var external = []
    var other = []

    /* this.item().identifier.forEach((val, i) => {
      var type = val.split(':')[1]
      var id = val.split(':')[2]
      var filterLink = this.renderFilterLink({ identifier: val }, `Find resources for ${val}`)
    */
    this.item().identifiers().forEach((identifier, i) => {
      var id = identifier.id
      var filterLink = this.renderFilterLink({ identifier: `urn:${identifier.type}:${identifier.id}` }, `Find resources for ${identifier.id}`)
      switch (identifier.type) {
        case 'bnum':
          if (!this.item().suppressed) external.push(<span key={i}><em>NYPL Catalog</em> <a target='_blank' href={`http://catalog.nypl.org/record=${id}`}>{id}</a> {filterLink}</span>)
          break
        case 'oclc':
          eachValue(id, (id) => {
            filterLink = this.renderFilterLink({ identifier: `urn:${identifier.type}:${id}` }, `Find resources for ${id}`)
            external.push(<span key={i}><em>Worldcat</em> <a target='_blank' href={`http://worldcat.org/oclc/${id}`}>{id}</a> {filterLink}</span>)
          })
          break
        case 'lccc':
          external.push(<span key={i}><em>NYPL B.I.L.L.I.</em> <a target='_blank' href={`http://billi.nypl.org/classmark/${id}`}>{id}</a> {filterLink}</span>)
          break
        case 'owi':
          external.push(<span key={i}><em>OCLC Classification</em> <a target='_blank' href={`http://classify.oclc.org/classify2/ClassifyDemo?owi=${id}`}>{id}</a> {filterLink}</span>)
          if (this.item() && this.item().hasRelated('owi')) external.push(<OWILinks item={this.item()} />)
          break
        case 'msscoll':
          external.push(<span key={i}><em>NYPL Archival Collection</em> <a target='_blank' href={`http://archives.nypl.org/${id}`}>{id}</a> {filterLink}</span>)
          break
        case 'mss':
          external.push(<span key={i}><em>NYPL Archives</em> <a target='_blank' href={`http://archives.nypl.org/detail/${id}`}>{id}</a> {filterLink}</span>)
          break
        case 'mmsdb':
          if (this.item().type.indexOf('nypl:Collection') >= 0) external.push(<span key={i}><em>MMS</em> <a target='_blank' href={`http://metadata.nypl.org/collection/${id}`}>{id}</a> {filterLink}</span>)
          else external.push(<span key={i}><em>MMS</em> <a target='_blank' href={`http://metadata.nypl.org/items/show/${id}`}>{id}</a> {filterLink}</span>)
          break
        case 'superparent':
          other.push(<span key={i}><em>Super Parent</em> <Link to={`/resources/${id}`}>{id}</Link> {filterLink}</span>)
          break

        default:
          other.push(<span key={i}>{identifier.id} {filterLink}</span>)
      }
    })

    return (
      <div key='identifiers'>
        {this.renderProperty('External Links', external)}
        {this.renderProperty(external.length > 0 ? 'Other Identifiers' : 'Identifiers', other)}
      </div>
    )
  },

  renderFilterLink (filters, description) {
    var url = ['/resources/search', '?', stringify({filters: filters})].join('')
    return <Link className='filter-link' to={url} title={description}><span className='nypl-icon-magnifier-circle' /></Link>
  },

  renderContributors () {
    var links = []
    this.item().contributorsWithRoles.forEach((contributor, i) => {
      var filterLink = this.renderFilterLink({ contributor: contributor['@id'] }, `Find with contributor ${contributor.prefLabel}`)
      var roles = null
      if (contributor.roles) {
        roles = (
          <em>
            {contributor.roles.map((role, i) => <span key={i}>{role.prefLabel}</span>)}
          </em>
        )
      }
      var rolesLine = roles ? <span> ({roles})</span> : null
      links.push(<span key={i}><Link to={urlFor(contributor)}>{contributor.prefLabel}</Link> {filterLink}{rolesLine}</span>)
    })

    return this.renderProperty('Contributors', links)
  },

  renderSubjects () {
    var links = []
    this.item().subject.forEach((subject, i) => {
      var filterLink = this.renderFilterLink({ subject: subject['@id'] }, `Find resources for ${subject.prefLabel}`)
      links.push(<span key={i}><Link to={urlFor(subject)}>{subject.prefLabel}</Link> {filterLink}</span>)
    })

    return this.renderProperty('Subjects', links)
  },

  renderBaseballCard () {
    var terms = []

    if (this.item()['@type']) {
      terms.push((
        <span key='type'>
          <dt>Type</dt>
          <dd>{eachValue(this.item()['@type'], (type, i) => <div key={i}>{type} {this.renderFilterLink({ type: type }, 'Find other resources with this type')}</div>)}</dd>
        </span>
      ))
    }

    if (this.item().type) {
      terms.push((
        <span key='resourceType'>
          <dt>Material Type</dt>
          <dd>{eachValue(this.item().materialType, (type, i) => <div key={i}><a href={`http://id.loc.gov/vocabulary/resourceTypes/${type.replace('resourcetypes:', '')}`}>{type.prefLabel}</a> {this.renderFilterLink({ materialType: type['@id'] }, 'Find other resources with this type')}</div>)}</dd>
        </span>
      ))
    }

    if (this.item().language) {
      var languageLines = this.item().language.map((lang, i) => {
        return <div key={i}><a href={`http://id.loc.gov/vocabulary/languages/${lang.prefLabel}`}>{lang.prefLabel}</a> {this.renderFilterLink({ language: lang['@id'] }, 'Find other resources with this language')}</div>
      })
      terms.push((
        <span key='language'>
          <dt>{pluralize('Language', this.item().language.length)}</dt>
          <dd>{languageLines}
          </dd>
        </span>
      ))
    }
    if (this.item().owner) {
      terms.push((
        <span key='owner'>
          <dt>Organization</dt>
          <dd>{this.item().owner.prefLabel} {this.renderFilterLink({ owner: this.item().owner['@id'] }, 'Find other resources by owner')}</dd>
        </span>
      ))
    }

    if (this.item().hasDates()) {
      terms.push((
        <span key='dates'>
          <dt>Dates</dt>
          <dd>{this.item().datesStatement()} {this.renderFilterLink(this.item().dateQuery(), 'Find other resources by dates')}</dd>
        </span>
      ))
    }
    if (this.item()) {
      terms.push((
        <span key='id'>
          <dt>ID</dt>
          <dd>{this.item().id}</dd>
        </span>
      ))
    }

    return (
      <dl key='baseballcard'>
      {terms}
      </dl>
    )
  },

  renderImage () {
    if (this.state && this.state.hasDepiction) {
      return <div ref='image_holder' className='resource-page-image'><img src={this.item().depiction} /></div>
    }
  },

  item () {
    return this.props.resource
  },

  renderHierarchy () {
    var parentsTopDown = this.item().parents ? [].concat([], this.item().parents).reverse() : []
    var parentLinks = parentsTopDown.map((parent, i) => <Link key={i} className={`level-${i}`} to={`/resources/${parent['@id']}`}>{parent.prefLabel}</Link>)
    var selfLink = <span key='self' className={`self level-${parentLinks.length}`}><b>{this.item().firstTitle()}</b></span>

    var childLinks = this.item().getRelated('children').map((child, i) => <Link className={`level-${parentLinks.length + 1}`} key={i} to={urlFor(child)}>{child.firstTitle()}</Link>)

    var links = [].concat(parentLinks, selfLink, childLinks)
    return (
      this.renderProperty('Hierarchy', links, 'hierarchy')
    )
  },

  render () {
    if (!this.item()) {
      if (this.props.isFetching) {
        return (
          <div>
            <HeaderNav title='data.nypl / Resources' link='/' />
            <Hero
              image={false}
              textUpper=''
              textMiddle='Loading...'
              textLower='' />
            <LoadingIndicator />
          </div>
        )
      } else {
        return <div>
          <HeaderNav title='data.nypl / Resources' link='/' />
          <Hero
            image={false}
            textUpper=''
            textMiddle='404: Not Found'
            textLower='' />
        </div>
      }
    } else {
      // console.log(this.state.data.idBnum[0], '$%^&#$')

      var textMiddle = ''
      var textLower = ''
      var imageUrl = false
      var textMiddleClass = 'agent-hero-middle-text'
      var textLowerClass = 'agent-hero-lower-text'
      if (this.item()) {
        textMiddle = this.item().firstTitle() // [0]
        // TODO: this looks funny cause it's already shown larger below:
        // if (this.state.hasDepiction) imageUrl = this.item().depiction

        if (this.item().subject) {
          textLower = this.item().subject.slice(0, 5).map((s) => s.prefLabel).join(', ')
          if (this.item().subject.length > 5) textLower += '...'
        }
      }

      var blocks = []
      if (this.item()) {
        if (this.item().description) blocks.push(<div className='resource-description' key='description'>{this.item().description}</div>)
        if (this.item().owner || this.item().type) blocks.push(this.renderBaseballCard())
        if ((this.item().parents && this.item().parents.length > 0) || (this.item().hasRelated('children'))) blocks.push(this.renderHierarchy())
        if (this.item().subject && this.item().subject.length > 0) blocks.push(this.renderSubjects())
        if (this.item().contributor && this.item().contributor.length > 0) blocks.push(this.renderContributors())
        if (this.item().note) blocks.push(this.renderProperty('Notes', this.item().note))
        if (this.item().identifiers()) blocks.push(this.renderIdentifiers())
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

function mapStateToProps (state) {
  const { resources } = state
  const {
    cached,
    currentResourceId
  } = resources || {
    cached: {},
    currentResourceId: null
  }

  var resource = null
  var isFetching = true
  var _version = 0
  if (currentResourceId && cached[currentResourceId]) {
    resource = cached[currentResourceId].item
    isFetching = cached[currentResourceId].isFetching
    _version = cached[currentResourceId]._version
  }

  return {
    resource,
    isFetching,
    _version
  }
}

function mapDispatchToProps (dispatch, props) {
  return bindActionCreators({ setCurrentId: setCurrentResourceId, fetchByOwi: fetchByOwiIfNeeded }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourcePage)
