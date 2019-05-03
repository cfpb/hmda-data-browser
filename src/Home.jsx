import React, { Component } from 'react'
import ImageCard from './ImageCard.jsx'
import Header from './common/Header.jsx'
import spreadsheet from './images/spreadsheet.png'
import selector from './images/selector.png'
import map from './images/map.png'

import './Home.css'

class Home extends Component {
  render() {
    return (
      <div className="home">
        <div className="intro">
          <Header type={1} headingText="HMDA Data Browser">
            <p className="lead">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eu varius orci. Nunc id augue justo. Fusce aliquam imperdiet lacus eu condimentum. Praesent et maximus ipsum. Fusce quis orci et lorem maximus maximus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
            </p>
          </Header>
        </div>

        <h3>I&#39;m interested in:</h3>

        <div className="card-container">
          <ImageCard
            image={spreadsheet}
            caption="Entire datasets (coming soon)"
            path="/all-data"
          >
            <ul>
              <li>Lorem ipsum dolor sit amet</li>
              <li>Mauris nec dolor id elit</li>
              <li>Aliquam facilisis lorem eget</li>
            </ul>
          </ImageCard>
          <ImageCard
            image={selector}
            year="2018"
            caption="Subsets of data"
            path="subsets"
            enabled
          >
            <ul>
              <li>Lorem ipsum dolor sit amet</li>
              <li>Mauris nec dolor id elit</li>
              <li>Aliquam facilisis lorem eget</li>
            </ul>
          </ImageCard>
          <ImageCard
            image={map}
            caption="Maps & Graphs (coming soon)"
            path="maps-graphs"
          >
            <ul>
              <li>Lorem ipsum dolor sit amet</li>
              <li>Mauris nec dolor id elit</li>
              <li>Aliquam facilisis lorem eget</li>
            </ul>
          </ImageCard>
        </div>
      </div>
    )
  }
}

export default Home
