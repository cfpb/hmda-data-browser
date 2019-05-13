import React, { Component } from 'react';
import Select from 'react-select';
import Header from '../common/Header.jsx';
import STATEOBJ from '../constants/stateObj.js';
import stateToMsas from '../constants/stateToMsas.js';
import ACTIONSTAKEN from '../constants/actionsTaken.js';
import RACES from '../constants/races.js';
import variables from '../constants/variables.js';

import './Subsets.css';

const actionsTakenOptions = ACTIONSTAKEN.map(actionTaken => {
  return { value: actionTaken.id, label: actionTaken.name };
});

const raceOptions = RACES.map(race => {
  return { value: race.id, label: race.name };
});

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
    super(props);
    this.onMsaMdsChange = this.onMsaMdsChange.bind(this);
    this.msaMdsOptions = this.loadStateAndMsaData()

    this.state = {
      state: '',
      msaMd: ''
    }
  }



  loadStateAndMsaData() {
    const subsetYear = this.props.location.pathname.split('/')[2]

    const statesWithMsas = stateToMsas[subsetYear]
    let msaMdsOptions = []

    Object.keys(statesWithMsas).forEach(state => {
      //state code
      if(state.length === 2) {
        msaMdsOptions.push({value: state, label: `${STATEOBJ[state]} - STATEWIDE`})
        statesWithMsas[state].forEach(msaMd => {
          msaMdsOptions.push({
            value: msaMd.id,
            label:  `${msaMd.id} - ${msaMd.name} - ${STATEOBJ[state]}`
          })
        })
      } else {
        //multistate
        statesWithMsas[state].forEach(msaMd => {
          msaMdsOptions.push({
            value: msaMd.id,
            label:  `${msaMd.id.replace('multi','')} - ${msaMd.name}`
          })
        })
      }
    })

    return msaMdsOptions
  }

  onMsaMdsChange(selectedOption) {
    const label = selectedOption.label
    let state, msaMd

    if(label.match('STATEWIDE'))
      state = label.split(' - ')[0]
    else if(label.match('ENTIRE MSAMD'))
      msaMd = selectedOption.value.replace('multi', '')
    else {
      const split = label.split(' - ')
      state = split[2]
      msaMd = split[0]
    }

    return this.setState({
      state,
      msaMd
    });
  }

  render() {
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
          <h4>Choose a state or MSA/MD:</h4>
          <Select
            styles={styleFn}
            onChange={this.onMsaMdsChange}
            placeholder="Select MSA/MD..."
            searchable={true}
            autoFocus
            openOnFocus
            simpleValue
            options={this.msaMdsOptions}
            value={this.state.selectMsaMds}
          />
        <div><h4 style={{display: 'inline-block'}}>State:&nbsp;</h4>{this.state.state ? this.state.state : <i>(none)</i>}</div>
        <div><h4 style={{display: 'inline-block'}}>MSA/MD:&nbsp;</h4>{this.state.msaMd ? this.state.msaMd : <i>(none)</i>}</div>
      </div>
    );
  }
}

export default Subsets;
