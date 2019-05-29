import React, { Component } from 'react'
import Select from 'react-select'
import Header from '../common/Header.jsx'
import { getSubsetDetails } from '../api.js'
import {
  createGeographyOptions,
  createVariableOptions,
  geographyStyleFn
} from './selectUtils.js'
import VARIABLES from '../constants/variables.js'

import './Subsets.css'

class Subsets extends Component {
  constructor(props) {
    super(props)
    this.onGeographyChange = this.onGeographyChange.bind(this)
    this.onVariableChange = this.onVariableChange.bind(this)
    this.requestSubset = this.requestSubset.bind(this)
    this.geographyOptions = createGeographyOptions(this.props)
    this.variableOptions = createVariableOptions()

    this.state = {
      state: '',
      msaMd: '',
      variables: {},
      aggregations: {}
    }
  }

  requestSubset() {
    getSubsetDetails(this.state)
      .then(res => { console.log(res) })
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
      msaMd
    })
  }

  onVariableChange(selectedVariables) {
    const selected = {}
    selectedVariables.forEach(variable => {
      const curr = this.state.variables[variable.value]
      if(curr) selected[variable.value] = curr
      else selected[variable.value] = {}
    })

    this.setState({
      variables: selected
    })
  }

  renderCheckboxes(variable) {
    return VARIABLES[variable].options.map((v) => {
      return (
        <div className="CheckboxWrapper" key={v.id}>
          <input onChange={e => {
            const newState = {
              variables: {
                ...this.state.variables,
                [variable]: {
                  ...this.state.variables[variable],
                  [v.id]: e.target.checked
                }
              }
            }

            if(!newState.variables[variable][v.id]) delete newState.variables[variable][v.id]

            this.setState(newState)
          }} id={variable + v.id} type="checkbox"></input>
          <label htmlFor={variable + v.id}>{v.name}</label>
        </div>
      )
    })
  }

  someChecksExist(){
    const vars = this.state.variables
    const keys = Object.keys(vars)
    for(let i=0; i < keys.length; i++){
      const checkVars = vars[keys[i]]
      const checkKeys = Object.keys(checkVars)
      for(let j=0; j < checkKeys.length; j++){
        if(checkVars[checkKeys[j]]) return true
      }
    }
    return false
  }

  render() {
    const { state, msaMd, variables } = this.state
    const variablesArr = Object.keys(variables)
    const checksExist = this.someChecksExist()

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
          <h4>Choose a state, MSA/MD, or nationwide:</h4>
          <Select
            styles={geographyStyleFn}
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
            openOnFocus
            simpleValue
            options={this.variableOptions}
          />
        </div>
        {state || msaMd ?
          <div className="QuerySummary">
            {state && msaMd ?
              <span>Querying for data in<b> MSA/MD {msaMd} </b>in<b> {state}</b></span>
            : state ?
              <span>Querying for data in<b> {state}</b></span>
            :
              <span>Querying for data in<b> MSA/MD {msaMd}</b></span>
            }
            <div className="CheckboxContainer">
              {variablesArr.length > 0
                ?
                  <div className="border">
                    <h3>{VARIABLES[variablesArr[0]].label}</h3>
                    {this.renderCheckboxes(variablesArr[0])}
                  </div>
                :
                  <div className="PlaceholderBorder border">
                    <span>Variable 1 Options</span>
                  </div>
              }
            </div>
            <div className="CheckboxContainer">
              {variablesArr.length > 1
                ?
                  <div className="border">
                    <h3>{VARIABLES[variablesArr[1]].label}</h3>
                    {this.renderCheckboxes(variablesArr[1])}
                  </div>
                :
                  <div className="PlaceholderBorder border">
                    <span>Variable 2 Options</span>
                  </div>
              }
            </div>
          <button onClick={this.requestSubset} disabled={!checksExist} className={ checksExist ? 'QueryButton' : 'QueryButton disabled'}>Get Subset Details</button>
          </div>
        : null
      }
      </div>
    )
  }
}
export default Subsets
