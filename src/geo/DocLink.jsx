import React from 'react'

function makeUrl({year, definition}) {
  return `/documentation/${year}/lar-data-fields/#${definition}`
}

const DocLink = props => {
  return (
    <a href={makeUrl(props)} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
  )
}

export default DocLink
