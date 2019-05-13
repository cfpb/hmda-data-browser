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

class Subsets extends Component {
  constructor(props) {
    super(props);
    this.onMsaMdsChange = this.onMsaMdsChange.bind(this);
    this.msaMdsOptions = this.loadStateAndMsaData()

    this.state = {
      selectMsaMds: ''
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
    return this.setState({
      selectMsaMds: selectedOption
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
            onChange={this.onMsaMdsChange}
            placeholder="Select MSA/MD..."
            searchable={true}
            autoFocus
            openOnFocus
            simpleValue
            options={this.msaMdsOptions}
            value={this.state.selectMsaMds}
          />
      </div>
    );
  }
}

export default Subsets;
