import React, { Component } from 'react'
import Select from 'react-select'
import { Link } from 'react-router-dom'
import Header from '../common/Header.jsx'
import Pills from './Pills.jsx'
import CheckboxContainer from './CheckboxContainer.jsx'
import Aggregations from './Aggregations.jsx'
import LoadingButton from './LoadingButton.jsx'
import Error from './Error.jsx'
import PDFIcon from '../images/PDFIcon.jsx'
import { getSubsetDetails, getGeographyCSV, getSubsetCSV } from '../api.js'
import { makeSearchFromState, makeStateFromSearch } from '../query.js'
import msaToName from '../constants/msaToName.js'
import VARIABLES from '../constants/variables.js'
import STATE_COUNTS from '../constants/stateCounts.js'
import MSAMD_COUNTS from '../constants/msamdCounts.js'
import {
  createStateOption,
  createMSAOption,
  createGeographyOptions,
  createVariableOptions,
  separateGeographyOptions,
  geographyStyleFn,
  formatWithCommas
} from './selectUtils.js'

import './Geography.css'


class Geography extends Component {
  constructor(props) {
    super(props)
    this.onGeographyChange = this.onGeographyChange.bind(this)
    this.onVariableChange = this.onVariableChange.bind(this)
    this.makeCheckboxChange = this.makeCheckboxChange.bind(this)
    this.requestSubset = this.requestSubset.bind(this)
    this.requestSubsetCSV = this.requestSubsetCSV.bind(this)
    this.requestGeographyCSV = this.requestGeographyCSV.bind(this)
    this.showAggregations = this.showAggregations.bind(this)
    this.setStateAndRoute = this.setStateAndRoute.bind(this)
    this.updateSearch = this.updateSearch.bind(this)
    this.scrollToTable = this.scrollToTable.bind(this)
    this.geographyOptions = createGeographyOptions(this.props)
    this.variableOptions = createVariableOptions()

    const [stateOptions, msaOptions] = separateGeographyOptions(this.geographyOptions)
    this.stateOptions = stateOptions
    this.msaOptions = msaOptions

    this.tableRef = React.createRef()
    this.state = this.buildStateFromQuerystring()

  }

  buildStateFromQuerystring(){
    const defaultState = {
      states: [],
      msamds: [],
      nationwide: false,
      isLargeFile: false,
      variables: {},
      variableOrder: [],
      details: {},
      loadingDetails: false,
      error: null
    }

    const newState = makeStateFromSearch(this.props.location.search, defaultState, this.requestSubset, this.updateSearch)
    newState.isLargeFile = newState.nationwide || this.checkIfLargeFile(newState.states, newState.msamds)
    return newState
  }

  updateSearch() {
    this.props.history.replace({search: makeSearchFromState(this.state)})
  }

  setStateAndRoute(state){
    state.loadingDetails = false
    return this.setState(state, this.updateSearch)
  }

  removeSelected(selected, options) {
    if(selected.length === 0) return options

    const trimmed = []
    selected = [...selected]

    for(let i=0; i < options.length; i++){
      if(!selected.length) trimmed.push(options[i])
      else {
        for(let j=0; j<selected.length; j++){
          if(selected[j].value === options[i].value){
            selected = [selected.slice(0,j), selected.slice(j+1)].flat()
            break
          } else if (j === selected.length - 1){
            trimmed.push(options[i])
          }
        }
      }
    }
    return trimmed
  }

  scrollToTable(){
    if(!this.tableRef.current) return
    this.tableRef.current.scrollIntoView({behavior: 'smooth', block: 'center'})
  }

  sortAggregations(aggregations, variableOrder) {
    function runSort(i, a, b){
      const currA = a[variableOrder[i]]
      const currB = b[variableOrder[i]]
      if(currA < currB) return -1
      if(currA > currB) return 1
      return runSort(i+1, a, b)
    }

    aggregations.sort(runSort.bind(null, 0))
  }

  requestGeographyCSV() {
    getGeographyCSV(this.state)
  }

  requestSubset() {
    this.setState({error: null, loadingDetails: true})
    return getSubsetDetails(this.state)
      .then(details => {
        this.sortAggregations(details.aggregations, this.state.variableOrder)
        setTimeout(this.scrollToTable, 100)
        return this.setStateAndRoute({details})
      })
      .catch(error => {
        return this.setStateAndRoute({error})
      })
  }

  requestSubsetCSV() {
    getSubsetCSV(this.state)
  }

  checkIfLargeFile(states, msamds) {
    if(states.length) return this.checkIfLargeCount(states, STATE_COUNTS)
    return this.checkIfLargeCount(msamds, MSAMD_COUNTS)
  }

  checkIfLargeCount(selected, countMap) {
    return selected.reduce((acc, curr) => acc + countMap[curr], 0) > 1048576
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
        details: {},
        isLargeFile: true
      })
    }

    states = [...new Set(states)]
    msamds = [...new Set(msamds)]

    return this.setStateAndRoute({
      states,
      msamds,
      nationwide: false,
      details: {},
      isLargeFile: this.checkIfLargeFile(states, msamds)
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
    return <div className="AggregationTotal">The filtered data contains <h4>{total}</h4> row{total === 1 ? '' : 's'}, each with all 107 public data fields.</div>
  }

  showAggregations(details, variableOrder){
    const total = formatWithCommas(this.makeTotal(details))
    return (
      <>
        <Aggregations ref={this.tableRef} details={details} variableOrder={variableOrder} year={this.props.match.params.year}/>
        <div className="CSVButtonContainer">
          {this.renderTotal(total)}
          <LoadingButton onClick={this.requestSubsetCSV} disabled={!total}>Download Filtered Data</LoadingButton>
        </div>
      </>
    )
  }

  setGeographySelect(states, msamds, nationwide){
    const options = []

    if(nationwide) return [{value: 'nationwide', label: 'NATIONWIDE'}]

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

  makeGeograpyPlaceholder(nationwide, geoValues) {
    if(nationwide) return 'Nationwide selected, clear this selection to pick states or MSA/MDs'
    if(geoValues.length){
      if(geoValues[0].value.length === 2) return 'Select or type additional states'
      return 'Select or type additional MSA/MDs'
    }
    return "Select or type a state, an MSA/MD, or 'nationwide'"
  }

  render() {
    const { nationwide, states, msamds, isLargeFile, variables, variableOrder, details, loadingDetails, error } = this.state
    const enabled = nationwide || states.length || msamds.length
    const checksExist = this.someChecksExist()
    const geoValues =  this.setGeographySelect(states, msamds, nationwide)
    const variableValues = this.setVariableSelect(variableOrder)

    return (
      <div className="Geography">
        <Link className="BackLink" to="../../">{'\u2b05'} DATA BROWSER HOME</Link>
        <div className="intro">
          <Header type={1} headingText="HMDA Dataset Filtering">
            <p className="lead">
              Download CSVs of HMDA data. These files contain all <a href="https://github.com/cfpb/hmda-platform/raw/master/docs/v2/spec/2018_Public_LAR_Data_Dictionary.pdf">data fields<PDFIcon /></a> available in the public data record and can be used for advanced analysis.
              For questions/suggestions, contact hmdafeedback@cfpb.gov.
            </p>
          </Header>
        </div>
        <div className="SelectWrapper">
          <h3>Dataset by Geography</h3>
          <p>Filter HMDA data by geography levels: nationwide, state, & MSA/MD</p>
          <Select
            controlShouldRenderValue={false}
            styles={geographyStyleFn}
            onChange={this.onGeographyChange}
            placeholder={this.makeGeograpyPlaceholder(nationwide, geoValues)}
            isMulti={true}
            searchable={true}
            autoFocus
            openOnFocus
            simpleValue
            value={geoValues}
            options={nationwide
              ? []
              : geoValues.length
                ? geoValues[0].value.length === 2
                  ? this.removeSelected(geoValues, this.stateOptions)
                  : this.removeSelected(geoValues, this.msaOptions)
                : this.geographyOptions
            }
          />
          <Pills values={geoValues} onChange={this.onGeographyChange} />
          <LoadingButton onClick={this.requestGeographyCSV} disabled={!enabled}>Download Dataset</LoadingButton>
          {isLargeFile ? <div className="LargeFileWarning"><h4>Warning:</h4> This dataset may be too large to be opened in standard spreadsheet applications</div>: null}
        </div>
        {enabled ?
          <>
            <div className="SelectWrapper">
              <h3>Dataset by Pre-selected Filters</h3>
              <p>Narrow down your geography selection by filtering on up to two popular variables</p>
              <Select
                controlShouldRenderValue={false}
                onChange={this.onVariableChange}
                placeholder={variableOrder.length >= 2 ? 'Remove a variable to select another' : 'Select a variable'}
                isMulti={true}
                searchable={true}
                openOnFocus
                simpleValue
                value={variableValues}
                options={variableOrder.length >= 2 ? [] : this.removeSelected(variableValues, this.variableOptions)}
              />
              <Pills values={variableValues} onChange={this.onVariableChange} />
              <div className="QuerySummary">
                {variableOrder.map(variable => {
                  return <CheckboxContainer key={variable} vars={variables} selectedVar={variable} callbackFactory={this.makeCheckboxChange} year={this.props.match.params.year}/>
                })}
              </div>
              <LoadingButton loading={loadingDetails} onClick={this.requestSubset} disabled={!checksExist}>View Data Summary</LoadingButton>
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
export default Geography
