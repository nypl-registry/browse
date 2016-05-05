import React from 'react'
import { Link } from 'react-router'

const OWILinks = React.createClass({
  render () {
    // var id = this.props.id
    var related = this.props.item.getRelated('owi').map((item) => {
      var url = `/resources/${item.id}`
      if (item.dateStart && item.title) {
        return <Link to={url}> ({item.dateStart}) {item.firstTitle()} </Link>
      } else if (item.title) {
        return <Link to={url}> {item.firstTitle()} </Link>
      }
    })

    return (
      <div className='resource-owi-box'>
        <ul>
          <lh><b>Related Editions</b></lh>
          {related.map((el) => <li>{el}</li>)}
        </ul>
      </div>
    )
  }
})

export default OWILinks
