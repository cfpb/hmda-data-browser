import React, { Component } from 'react'
import ImageCard from './ImageCard.jsx'
import Header from './common/Header.jsx'
import Beta from './Beta.jsx'

import './Home.css'

class Home extends Component {
  render() {
    return (
      <div className="home">
        <Beta/>
        <div className="intro">
          <Header type={1} headingText="HMDA Data Browser">
            <p className="lead">The HMDA Data Browser allows users to filter, analyze, and download HMDA datasets and visualize data through charts, graphs, and maps.</p>
          </Header>
        </div>

        <h3>I&#39;m interested in:</h3>

        <div className="card-container">
          <ImageCard
            year="2018"
            caption="HMDA Dataset Filtering"
            path="data"
            enabled
          >Download entire datasets by state, MSA/MD, or nationwide or filter them by selected variables.
          </ImageCard>
          <ImageCard
            caption="Maps & Graphs (coming soon)"
            path="maps-graphs"
          >
          Visualize HMDA data through charts, graphs, and maps.

          </ImageCard>
        </div>
      </div>
    )
  }
}

export default Home
