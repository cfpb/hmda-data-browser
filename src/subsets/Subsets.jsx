import React, { Component } from 'react'
import Select from 'react-select'
import Header from '../common/Header.jsx'
import CheckboxContainer from './CheckboxContainer.jsx'
import Aggregations from './Aggregations.jsx'
import Error from './Error.jsx'
import { getSubsetDetails, getCSV } from '../api.js'
import { makeSearchFromState, makeStateFromSearch } from '../query.js'
import msaToName from '../constants/msaToName.js'
import VARIABLES from '../constants/variables.js'
import {
  createStateOption,
  createMSAOption,
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
    this.setStateAndRoute = this.setStateAndRoute.bind(this)
    this.geographyOptions = createGeographyOptions(this.props)
    this.variableOptions = createVariableOptions()

    this.state = this.buildStateFromQuerystring()

  }

  buildStateFromQuerystring(){
    const defaultState = {
      states: [],
      msamds: [],
      nationwide: false,
      variables: {},
      variableOrder: [],
      details: {},
      error: null
    }

    return makeStateFromSearch(this.props.location.search, defaultState, this.requestSubset)
  }

  setStateAndRoute(state){
   this.setState(state, () => {
     this.props.history.replace({search: makeSearchFromState(this.state)})
   })
  }

  requestSubset() {
    getSubsetDetails(this.state)
      .then(details => {
        this.setStateAndRoute({details})
      })
      .catch(error => {
        this.setStateAndRoute({error})
      })
  }

  requestSubsetCSV() {
    getCSV(this.state)
      .catch(error => {
        this.setStateAndRoute({error})
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
      //else if(value.match('multi'))
      //  msamds.push(value.replace('multi', ''))
      else {
        const split = label.split(' - ')
        msamds.push(split[0])
      }
    })

    if(isNationwide){
      return this.setStateAndRoute({
        nationwide: true,
        states: [],
        msamds: [],
        details: {}
      })
    }

    states = [...new Set(states)]
    msamds = [...new Set(msamds)]

    return this.setStateAndRoute({
      states,
      msamds,
      nationwide: false,
      details: {}
    })
  }

  onVariableChange(selectedVariables, change) {
    const variableOrder = selectedVariables.map(v => v.value)
    const selected = {}
    selectedVariables.forEach(variable => {
      const curr = this.state.variables[variable.value]
      if(curr) selected[variable.value] = curr
      else selected[variable.value] = {}
    })

    this.setStateAndRoute({
      variables: selected,
      variableOrder,
      details: {}
    })
  }

  makeCheckboxChange(variable, subvar) {
    return e => {
      const newState = {
        details: {},
        variables: {
          ...this.state.variables,
          [variable]: {
            ...this.state.variables[variable],
            [subvar.id]: e.target.checked
          }
        }
      }

      if(!newState.variables[variable][subvar.id]) delete newState.variables[variable][subvar.id]

      this.setStateAndRoute(newState)
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

  showAggregations(details, variableOrder){
    const total = this.makeTotal(details)
    return (
      <>
        <Aggregations details={details} variableOrder={variableOrder}/>
        <div className="CSVButtonContainer">
          <button onClick={this.requestSubsetCSV} disabled={!total} className={total ? 'QueryButton CSVButton' : 'QueryButton CSVButton disabled'}>Download Data</button>
          {this.renderTotal(total)}
        </div>
      </>
    )
  }

  setGeographySelect(states, msamds, nationwide){
    const options = []

    if(nationwide) return {value: 'nationwide', label: 'NATIONWIDE'}

    if(states.length){
      states.forEach(state => {
        createStateOption(state, options)
      })
    }

    if(msamds.length){
      msamds.forEach(msa => {
        createMSAOption(msa, msaToName[msa], options)
      })
    }

    return options
  }

  setVariableSelect(variableOrder){
    const options = []
    variableOrder.forEach(v => {
      options.push({value: v, label: VARIABLES[v].label})
    })
    return options
  }

  render() {
    console.log(this.state)
    const { nationwide, states, msamds, variables, variableOrder, details, error } = this.state
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
            isMulti={true}
            searchable={true}
            autoFocus
            openOnFocus
            simpleValue
            value={this.setGeographySelect(states, msamds)}
            options={nationwide ? [] : this.geographyOptions}
          />
          <h4>Choose up to two variables:</h4>
          <Select
            onChange={this.onVariableChange}
            placeholder="Select a variable"
            isMulti={true}
            searchable={true}
            openOnFocus
            simpleValue
            value={this.setVariableSelect(variableOrder)}
            options={variableOrder.length >= 2 ? [] : this.variableOptions}
          />
        </div>
        {nationwide || states.length || msamds.length ?
          <>
            <div className="QuerySummary">
              <CheckboxContainer vars={variables} selectedVar={variableOrder[0]} position={1} callbackFactory={this.makeCheckboxChange}/>
              <CheckboxContainer vars={variables} selectedVar={variableOrder[1]} position={2} callbackFactory={this.makeCheckboxChange}/>
            <button onClick={this.requestSubset} disabled={!checksExist} className={ checksExist ? 'QueryButton' : 'QueryButton disabled'}>Get Subset Details</button>
            </div>
            {error ? <Error error={error}/> : null}
            {details.aggregations && !error ? this.showAggregations(details, variableOrder) : null}
          </>
        : null
      }
      </div>
    )
  }
}
export default Subsets
