import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './ImageCard.css'

const ImageCard = props => {
  console.log(props)
  let cardClass='ImageCard card'
  if(props.enabled) cardClass += ' enabled'

  return (
    <div className={cardClass}>
      <Link
        disabled={!props.enabled}
        to={props.path+"/"+props.year}>
        <div className="ImageWrapper">
          <img src={props.image} alt={props.caption} className="imagechild"/>
        </div>
        <h4>{props.caption}</h4>
      </Link>
      {props.children}
    </div>
  )
}

export default ImageCard
