import React, { Component } from 'react'
import './Card.css'

const ImageCard = props => {
  return (
    <div className="ImageCard card">
      <div className="ImageWrapper">
        <img src={props.image} alt={props.caption} className="imagechild"/>
      </div>
      <h4>{props.caption}</h4>
    </div>
  )
}

export default ImageCard
