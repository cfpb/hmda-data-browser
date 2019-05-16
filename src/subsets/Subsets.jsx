import React, { Component } from 'react'
import Select from 'react-select'
import Header from '../common/Header.jsx'
import STATEOBJ from '../constants/stateObj.js'
import stateToMsas from '../constants/stateToMsas.js'
import VARIABLES from '../constants/variables.js'

import './Subsets.css'

const variableOptions = Object.keys(VARIABLES).map(variable => {
  return { value: variable, label: VARIABLES[variable].label }
})

const styleFn = {
  option: (provided, state) => {
   if (state.data.value.length === 2) {
     return {
       ...provided,
       fontWeight: 'bold',
       textDecoration: 'underline'
     }
   }
   return provided
  }
}

class Subsets extends Component {
  constructor(props) {
    super(props)
    this.onGeographyChange = this.onGeographyChange.bind(this)
    this.onVariableChange = this.onVariableChange.bind(this)
    this.geographyOptions = this.createGeographyOptions()
    this.variableOptions = variableOptions

    this.state = {
      state: '',
      msaMd: '',
      variables: []
    }
  }

  createGeographyOptions() {
    const subsetYear = this.props.location.pathname.split('/')[2]

    const statesWithMsas = stateToMsas[subsetYear]
    let geographyOptions = []

    Object.keys(statesWithMsas).forEach(state => {
      //state code
      if(state.length === 2) {
        geographyOptions.push({value: state, label: `${STATEOBJ[state]} - STATEWIDE`})
        statesWithMsas[state].forEach(msaMd => {
          geographyOptions.push({
            value: msaMd.id,
            label:  `${msaMd.id} - ${msaMd.name} - ${STATEOBJ[state]}`
          })
        })
      } else {
        //multistate
        statesWithMsas[state].forEach(msaMd => {
          geographyOptions.push({
            value: msaMd.id,
            label:  `${msaMd.id.replace('multi','')} - ${msaMd.name} - ENTIRE MSA/MD`
          })
        })
      }
    })

    return geographyOptions
  }

  onGeographyChange(selectedOption) {
    let state, msaMd
    let { value, label } = selectedOption
    value = value + ''

    if(!label) return

    if(label.match('STATEWIDE'))
      state = label.split(' - ')[0]
    else if(value.match('multi'))
      msaMd = selectedOption.value.replace('multi', '')
    else {
      const split = label.split(' - ')
      state = split[2]
      msaMd = split[0]
    }

    return this.setState({
      state,
      msaMd
    })
  }

  onVariableChange(selectedOptions) {
    this.setState({
      variables: selectedOptions.map(option => {
        return {id: option.value, selectedOptions: []}
      })
    })
  }

  renderCheckboxes(variable) {
    return VARIABLES[variable].options.map((v) => {
      return (
        <div className="CheckboxWrapper" key={v.id}>
          <input id={variable + v.id} type="checkbox"></input>
          <label htmlFor={variable + v.id}>{v.name}</label>
        </div>
      )
    })
  }

  render() {
    const { location } = this.props
    const subsetYear = location ? location.pathname.split('/')[2] : 'NA'
    return (
      <div className="Subsets">
        <div className="intro">
          <Header type={1} headingText="Subsets of HMDA data">
            <p className="lead">
              Customize your analysis of HMDA data. Create subsets of data here,
              using pre-selected filters that allow you to compare queries. For
              questions/suggestions, contact hmdafeedback@cfpb.gov.
            </p>
          </Header>
        </div>
        <div className="Selects">
          <h4>Choose a state or MSA/MD:</h4>
          <Select
            styles={styleFn}
            onChange={this.onGeographyChange}
            placeholder="Select MSA/MD..."
            searchable={true}
            autoFocus
            openOnFocus
            simpleValue
            options={this.geographyOptions}
          />
          <h4>Choose up to two variables:</h4>
          <Select
            onChange={this.onVariableChange}
            placeholder="Select a variable"
            isMulti={true}
            searchable={true}
            autoFocus
            openOnFocus
            simpleValue
            options={this.variableOptions}
          />
        </div>
        {this.state.state || this.state.msaMd ?
          <div className="QuerySummary">
            {this.state.state && this.state.msaMd ?
              <span>Querying for data in<b> MSA/MD {this.state.msaMd} </b>in<b> {this.state.state}</b></span>
            : this.state.state ?
              <span>Querying for data in<b> {this.state.state}</b></span>
            :
              <span>Querying for data in<b> MSA/MD {this.state.msaMd}</b></span>
            }
            <div className="CheckboxContainer">
              {this.state.variables.length > 0
                ?
                  <div className="border">
                    <h3>{VARIABLES[this.state.variables[0]].label}</h3>
                    {this.renderCheckboxes(this.state.variables[0])}
                  </div>
                :
                  <div className="PlaceholderBorder border">
                    <span>Variable 1 Options</span>
                  </div>
              }
            </div>
            <div className="CheckboxContainer">
              {this.state.variables.length > 1
                ?
                  <div className="border">
                    <h3>{VARIABLES[this.state.variables[1]].label}</h3>
                    {this.renderCheckboxes(this.state.variables[1])}
                  </div>
                :
                  <div className="PlaceholderBorder border">
                    <span>Variable 2 Options</span>
                  </div>
              }
            </div>
          <button disabled={1} className={ 1 ? 'QueryButton disabled' : 'QueryButton'}>Get Subset</button>
          </div>
        : null
      }
      </div>
    )
  }
}
export default Subsets
