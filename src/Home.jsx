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
            <p className="lead">The HMDA Data Browser allows institutions to filter and analyze HMDA data, download whole data sets, and visualize data through charts, graphs, and maps.</p>
          </Header>
        </div>

        <h3>I&#39;m interested in:</h3>

        <div className="card-container">
          <ImageCard
            image={spreadsheet}
            caption="Entire datasets (coming soon)"
            path="/all-data"
          >Run a data set query and download the entire raw dataset.
          </ImageCard>
          <ImageCard
            image={selector}
            year="2018"
            caption="Subsets of data"
            path="subsets"
            enabled
          >
        Customize your analysis of HMDA data. Create subsets of data here, using pre-selected filters that allow you to compare queries.
          </ImageCard>
          <ImageCard
            image={map}
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
