import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { firstValue, joinedValues } from '../utils.js'

import { setCurrentAgentId } from '../actions/agents'

import WindowTitleMixin from '../lib/windowTitleMixin'
import HeaderNav from '../components/shared/headerNav.js'
import Hero from '../components/shared/hero.js'
import Footer from '../components/shared/footer.js'
import AgentPageResources from '../components/agents/agentPageResources.js'

const AgentPage = React.createClass({
  mixins: [WindowTitleMixin],

  componentDidMount () {
    const { params } = this.props
    this.props.setCurrentId(parseInt(params.id))
  },

  componentWillReceiveProps (nextProps) {
    const { params } = nextProps
    this.props.setCurrentId(parseInt(params.id))

    if (nextProps.agent) this.setWindowTitle('Agents', nextProps.agent.prefLabel)
  },

  render () {
    if (!this.props.agent) {
      return (
        <div>
          <HeaderNav title='data.nypl / Agents' link='/' />
          <Hero
            image={false}
            textUpper=''
            textMiddle='Loading...'
            textLower='' />
        </div>
      )
    } else {
      console.log(this.props.agent)
      var textMiddleClass = 'agent-hero-middle-text'
      var textLowerClass = 'agent-hero-lower-text'
      var imageUrl = `https://s3.amazonaws.com/data.nypl.org/wikimedia_cache/${firstValue(this.props.agent.depiction)}`
      var textMiddle = firstValue(this.props.agent.prefLabel)
      var desc = joinedValues(this.props.agent.description, ' ')
      var textLower = desc
      if (firstValue(this.props.agent.prefLabel) && this.props.agent.topFiveRolesString.length > 0) {
        textLower += '\n' + this.props.agent.topFiveRolesString.join(', ')
      }

      return (
        <div>
          <HeaderNav title='data.nypl / Agents' link='/agents' />
          <Hero
            textMiddleClass={textMiddleClass}
            textLowerClass={textLowerClass}
            image={{ url: imageUrl, title: '', link: '' }}
            textUpper=''
            textMiddle={textMiddle}
            textLower={textLower} />
          <AgentPageResources key={this.props.params.id} agent={this.props.agent} agentUri={this.props.params.id} />
          <Footer />
        </div>
      )
    }
  }
})

function mapStateToProps (state) {
  const { agents } = state
  const {
    cached,
    currentAgentId
  } = agents || {
    cached: {}
  }

  var agent = null
  var isFetching = true
  if (currentAgentId && cached[currentAgentId]) {
    agent = cached[currentAgentId].item
    isFetching = cached[currentAgentId].isFetching
  }

  return {
    agent,
    isFetching
  }
}

function mapDispatchToProps (dispatch, props) {
  return bindActionCreators({ setCurrentId: setCurrentAgentId }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AgentPage)
