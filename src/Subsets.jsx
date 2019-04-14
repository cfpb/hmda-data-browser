import React, { Component } from 'react'
import Select from 'react-select'
import Header from './common/Header.jsx'
import STATES from './constants/states.js'

import './Subsets.css'

const options = STATES.map(state => {
  return { value: state.id, label: state.name }
})

class Subsets extends Component {
  render() {
    return (
      <div className="Subsets">
        <div className="intro">
          <Header type={1} headingText="Subsets of HMDA data">
            <p className="lead">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eu varius orci. Nunc id augue justo. Fusce aliquam imperdiet lacus eu condimentum. Praesent et maximus ipsum. Fusce quis orci et lorem maximus maximus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
            </p>
          </Header>
        </div>
        <>
          <Header type={4} headingText="Select a state" />
          <Select
            onChange={this.handleChange}
            placeholder="Select a state..."
            searchable={true}
            autoFocus
            openOnFocus
            simpleValue
            options={options}
          />
        </>
        <div>
        </div>
      </div>
    )
  }
}

export default Subsets
