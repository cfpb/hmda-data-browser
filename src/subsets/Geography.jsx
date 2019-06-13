import React, { Component } from 'react'
import Select from 'react-select'
import Header from '../common/Header.jsx'
import Error from './Error.jsx'
import { getCSV } from '../api.js'
import {
  createGeographyOptions,
  geographyStyleFn
} from './selectUtils.js'

import './Subsets.css'

class Geography extends Component {
  constructor(props) {
    super(props)
    this.onGeographyChange = this.onGeographyChange.bind(this)
    this.requestGeographyCSV = this.requestGeographyCSV.bind(this)
    this.geographyOptions = createGeographyOptions(this.props)

    this.state = {
      states: [],
      msamds: [],
      nationwide: false,
      error: null
    }
  }

  requestGeographyCSV() {
    getCSV(this.state)
      .catch(error => {
        this.setState({error})
      })
  }

  onGeographyChange(selectedGeographies) {
    let states = []
    let msamds = []
    let isNationwide = false

    selectedGeographies.forEach(geography => {
      let { value, label } = geography
      value = value + ''

      if(!label) return

      if(value === 'nationwide') isNationwide = true

      if(label.match('STATEWIDE'))
        states.push(value)
      else if(value.match('multi'))
        msamds.push(value.replace('multi', ''))
      else {
        const split = label.split(' - ')
        states.push(geography.state)
        msamds.push(split[0])
      }
    })

    if(isNationwide){
      return this.setState({
        nationwide: true,
        states: [],
        msamds: []
      })
    }

    states = [...new Set(states)]
    msamds = [...new Set(msamds)]

    return this.setState({
      states,
      msamds,
      nationwide: false
    })
  }

  render() {
    const { nationwide, states, msamds, error } = this.state

    const isDisabled = !(nationwide || states.length || msamds.length)

    return (
      <div className="Subsets">
        <div className="intro">
          <Header type={1} headingText="HMDA data by Geography">
            <p className="lead">
              Download CSVs of HMDA data by state, MSA, or nationwide.
              These files contain every collected data variable and can be used for advanced analysis.
              The large size of these files may prevent the use of common spreadsheet programs.
            </p>
          </Header>
        </div>
        <div className="Selects">
          <h4>Choose a state, MSA/MD, or nationwide:</h4>
          <Select
            styles={geographyStyleFn}
            onChange={this.onGeographyChange}
            placeholder="Select a state or MSA/MD"
            isMulti={true}
            searchable={true}
            autoFocus
            openOnFocus
            simpleValue
            options={this.geographyOptions}
          />
        </div>
        {error ? null : <button onClick={this.requestGeographyCSV} disabled={isDisabled} className={ isDisabled ? 'QueryButton disabled' : 'QueryButton'}>Download Data</button>}
        {error ? <Error error={error}/> : null}
      </div>
    )
  }
}
export default Geography
