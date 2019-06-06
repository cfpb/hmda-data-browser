import React, { Component } from 'react'
import Select from 'react-select'
import Header from '../common/Header.jsx'
import CheckboxContainer from './CheckboxContainer.jsx'
import Aggregations from './Aggregations.jsx'
import Error from './Error.jsx'
import { getSubsetDetails, getCSV } from '../api.js'
import {
  createGeographyOptions,
  createVariableOptions,
  geographyStyleFn
} from './selectUtils.js'

import './Subsets.css'

class Subsets extends Component {
  constructor(props) {
    super(props)
    this.onGeographyChange = this.onGeographyChange.bind(this)
    this.onVariableChange = this.onVariableChange.bind(this)
    this.makeCheckboxChange = this.makeCheckboxChange.bind(this)
    this.requestSubset = this.requestSubset.bind(this)
    this.requestSubsetCSV = this.requestSubsetCSV.bind(this)
    this.showAggregations = this.showAggregations.bind(this)
    this.geographyOptions = createGeographyOptions(this.props)
    this.variableOptions = createVariableOptions()

    this.state = {
      state: '',
      msaMd: '',
      variables: {},
      details: {},
      error: null
    }
  }

  requestSubset() {
    getSubsetDetails(this.state)
      .then(details => {
        this.setState({details})
      })
      .catch(error => {
        this.setState({error})
      })
  }

  requestSubsetCSV() {
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

  onVariableChange(selectedVariables) {
    const selected = {}
    selectedVariables.forEach(variable => {
      const curr = this.state.variables[variable.value]
      if(curr) selected[variable.value] = curr
      else selected[variable.value] = {}
    })

    this.setState({
      variables: selected,
      details: {}
    })
  }

  makeCheckboxChange(variable, subvar) {
    return e => {
      const newState = {
        variables: {
          ...this.state.variables,
          [variable]: {
            ...this.state.variables[variable],
            [subvar.id]: e.target.checked
          }
        }
      }

      if(!newState.variables[variable][subvar.id]) delete newState.variables[variable][subvar.id]

      this.setState(newState)
    }
  }

  someChecksExist(){
    const vars = this.state.variables
    const keys = Object.keys(vars)
    if(!keys[0]) return false

    const checkVars = vars[keys[0]]
    const checkKeys = Object.keys(checkVars)
    for(let j=0; j < checkKeys.length; j++){
      if(checkVars[checkKeys[j]]) return true
    }
    return false
  }

  makeTotal(details) {
    return details.aggregations.reduce((acc, curr) => {
      return acc + curr.count
    }, 0)
  }

  renderTotal(total){
    return <div className="AggregationTotal">Data contains <h4>{total}</h4> row{total === 1 ? '' : 's'}</div>
  }

  showAggregations(details, variablesArr){
    const total = this.makeTotal(details)
    return (
      <>
        <Aggregations details={details} variablesArr={variablesArr}/>
        <div className="CSVButtonContainer">
          <button onClick={this.requestSubsetCSV} disabled={!total} className={total ? 'QueryButton CSVButton' : 'QueryButton CSVButton disabled'}>Download Data</button>
          {this.renderTotal(total)}
        </div>
      </>
    )
  }

  render() {
    const { state, msaMd, variables, details, error } = this.state
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
            placeholder="Select a state or MSA/MD"
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
            options={variablesArr.length >= 2 ? [] : this.variableOptions}
          />
        </div>
        {state || msaMd ?
          <>
            <div className="QuerySummary">
              {state && msaMd ?
                <span>Querying for data in<b> MSA/MD {msaMd} </b>in<b> {state}</b></span>
              : state ?
                <span>Querying for data in<b> {state}</b></span>
              :
                <span>Querying for data in<b> MSA/MD {msaMd}</b></span>
              }
              <CheckboxContainer vars={variablesArr} position={1} callbackFactory={this.makeCheckboxChange}/>
              <CheckboxContainer vars={variablesArr} position={2} callbackFactory={this.makeCheckboxChange}/>
            <button onClick={this.requestSubset} disabled={!checksExist} className={ checksExist ? 'QueryButton' : 'QueryButton disabled'}>Get Subset Details</button>
            </div>
            {error ? <Error error={error}/> : null}
            {details.aggregations && !error ? this.showAggregations(details, variablesArr) : null}
          </>
        : null
      }
      </div>
    )
  }
}
export default Subsets
