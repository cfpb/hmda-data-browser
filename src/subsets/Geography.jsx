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
      state: '',
      msaMd: '',
      error: null
    }
  }

  requestGeographyCSV() {
    getCSV(this.state)
      .catch(error => {
        this.setState({error})
      })
  }


  onGeographyChange(selectedOption) {
    let state, msaMd
    let { value, label } = selectedOption
    value = value + ''

    if(!label) return

    if(value === 'nationwide') {
      state = 'nationwide'
    }
    else if(label.match('STATEWIDE'))
      state = value
    else if(value.match('multi'))
      msaMd = value.replace('multi', '')
    else {
      const split = label.split(' - ')
      state = selectedOption.state
      msaMd = split[0]
    }

    return this.setState({
      state,
      msaMd,
      details: {}
    })
  }

  render() {
    const { state, msaMd, error } = this.state

    const isDisabled = !state && !msaMd

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
