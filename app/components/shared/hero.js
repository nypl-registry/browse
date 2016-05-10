import React from 'react'
import { downloadCover } from '../../utils.js'

const Hero = React.createClass({
  componentWillMount () {
    this.setState({ heroImageStyle: {} })
    this.setState({ heroImageLink: '' })
    this.setState({ heroImageAlt: '' })
    this.setState({ maskStyle: {} })
  },

  shouldComponentUpdate () {
    return true
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({image: false})

    if (nextProps && nextProps.image && nextProps.image.url && nextProps.image.url.idBnum) {
      downloadCover(nextProps.image.url.idBnum, function (err, results) {
        if (err) throw err
        if (results) {
          this.setState({image: results})
        }
      }.bind(this))
    }
  },

  render () {
    var hideImage = false
    var maskStyle = {}
    var textMiddleClass = ''
    var textLowerClass = ''
    var heroImageStyle = null
    if (Array.isArray(this.props.image)) {
      var random = this.props.image[Math.floor(Math.random() * this.props.image.length)]
      heroImageStyle = { backgroundPositionX: '-30px', backgroundImage: 'url(http://images.nypl.org/index.php?id=' + random.imageID + '&t=w)', backgroundSize: 'cover' }
      var heroImageLink = random.url
      var heroImageAlt = random.title
    } else if (this.props.image) {
      heroImageStyle = { backgroundPositionX: 'center', backgroundImage: `url(${this.props.image.url})`, backgroundSize: 'cover' }

      if (this.props && this.props.image && this.props.image.url && this.props.image.url.idBnum) hideImage = true
    } else if (!this.props.image) {
      maskStyle = {display: 'none'}
    }

    var textMiddle = this.props.textMiddle

    if (textMiddle.length > 80) textMiddle = `${textMiddle.substr(0, 80)}...`

    if (this.props.image) if (this.props.image.url === false) maskStyle = {display: 'none'}
    if (hideImage) maskStyle = {display: 'none'}

    if (this.state.image) {
      heroImageStyle = { backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundImage: `url("data:image/jpg;base64,${this.state.image}")`, backgroundSize: 'contain' }
      maskStyle = {}
    }

    if (this.props.textMiddleClass) textMiddleClass = this.props.textMiddleClass
    if (this.props.textLowerClass) textLowerClass = this.props.textLowerClass

    var textLower = ''
    if (this.props.textLower) textLower = this.props.textLower.split('\n').map((t, i) => <div key={i}>{t}</div>)

    return (
      <div className='hero'>
        <div className='container'>
          <div className='row'>
            <div className='six columns hero-left'>
              <div>
                {this.props.textUpper}
              </div>
              <h2 className={textMiddleClass}>{textMiddle}</h2>
              <div className={textLowerClass}>
                {textLower}
              </div>
            </div>
            <div className='six columns hero-right'>
              <div style={maskStyle} className='mask'>
                <a title={heroImageAlt} href={heroImageLink}>
                  <div
                    alt={heroImageAlt}
                    title={heroImageAlt}
                    style={heroImageStyle}
                    className='billi-logo'> </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default Hero
