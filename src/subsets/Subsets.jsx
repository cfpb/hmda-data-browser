import React, { Component } from "react";
import Select from "react-select";
import Header from "../common/Header.jsx";
import STATES from "../constants/states.js";
import LoadingIcon from "../common/LoadingIcon.jsx";
import stateToMsas from "../constants/stateToMsas.js";
import ACTIONSTAKEN from "../constants/actionsTaken.js";
import RACES from "../constants/races.js";
import variables from "../constants/variables.js";

import "./Subsets.css";

const detailsCache = {
  2018: {
    states: {},
    races: {},
    actionsTaken: {}
  }
};

const stateOptions = STATES.map(state => {
  return { value: state.id, label: state.name };
});

const actionsTakenOptions = ACTIONSTAKEN.map(actionTaken => {
  return { value: actionTaken.id, label: actionTaken.name };
});

const raceOptions = RACES.map(race => {
  return { value: race.id, label: race.name };
});

class Subsets extends Component {
  constructor(props) {
    super(props);
    this.handleStateUpdate = this.handleStateUpdate.bind(this);
    this.handleMsaMdsUpdate = this.handleMsaMdsUpdate.bind(this);
    this.onMsaMdsChange = this.onMsaMdsChange.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.handleActionTakenUpdate = this.handleActionTakenUpdate.bind(this);
    this.handleRaceUpdate = this.handleRaceUpdate.bind(this);
    this.loadVarSelect = this.loadVarSelect.bind(this);
    this.state = {
      selectState: "",
      selectMsaMds: "",
      selectActionTaken: "",
      selectRace: ""
    };
  }

  handleStateUpdate(val) {
    this.onStateChange(val);
    this.props.history.push({
      pathname: `${this.props.match.url}/${val.value}`
    });
  }

  handleMsaMdsUpdate(val) {
    this.onMsaMdsChange(val);
    this.props.history.push({
      pathname: `${this.props.history.location.pathname}/${val.value}`
    });
  }


  loadMsaSelect(subsetYear) {
    let msaMds = stateToMsas[subsetYear][this.state.selectState.value];
    let msaMdsOptions = msaMds
      ? msaMds.map(msaMd => {
          return { value: msaMd.id, label: msaMd.name };
        })
      : [{ id: "", value: "" }];

    return (
      <Select
        isDisabled={this.state.selectState.value ? false : true}
        onChange={this.handleMsaMdsUpdate}
        placeholder="Select MSA/MD..."
        searchable={true}
        autoFocus
        openOnFocus
        simpleValue
        options={msaMdsOptions}
        value={this.state.selectMsaMds}
      />
    );
  }

  loadVarSelect(varOption,varListName) {
    console.log(varOption)
    console.log(varListName)

    console.log(variables)

   let varList = variables[varOption][varListName];
   let varOptions = varList
     ? varList.map(variableOption => {
         return { value: variableOption.id, label: variableOption.name };
       })
     : [{ id: "", value: "" }];
    return (
      <Select
        isDisabled={this.state.selectState.value ? false : true}
        onChange={varOption==='1'?this.handleActionTakenUpdate:this.handleRaceUpdate}
        placeholder={"Select variable"+varOption+"..."}
        searchable={true}
        autoFocus
        openOnFocus
        simpleValue
        options={varOptions}
        value={varOption==='1'?this.state.selectActionTaken:this.state.selectRace}
      />
    );
  }

  onStateChange(selectedOption) {
    return this.setState({
      selectState: selectedOption,
      selectMsaMds: "",
      selectActionTaken: "",
      selectRace: ""
    });
  }
  onMsaMdsChange(selectedOption) {
    return this.setState({
      selectMsaMds: selectedOption
    });
  }

  handleActionTakenUpdate(selectedOption) {
    return this.setState({
      selectActionTaken: selectedOption
    });
  }

  handleRaceUpdate(selectedOption) {
    return this.setState({
      selectRace: selectedOption
    });
  }

  render() {
    const { match, location } = this.props;
    const subsetYear = location.pathname.split("/")[2];
// console.log(this.state.selectMsaMds)
// console.log(this.state.selectRace)
// console.log(this.state.selectActionTaken)
// console.log(this.state.selectState)

    return (
      <div className="Subsets">
        <div className="intro">
          <Header type={1} headingText="Subsets of HMDA data">
            <p className="lead">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eu
              varius orci. Nunc id augue justo. Fusce aliquam imperdiet lacus eu
              condimentum. Praesent et maximus ipsum. Fusce quis orci et lorem
              maximus maximus. Pellentesque habitant morbi tristique senectus et
              netus et malesuada fames ac turpis egestas.
            </p>
          </Header>
        </div>
        <table>
          <thead>
            <tr>
              <th width="50%">Select a State: </th>
              <th width="50%">Choose an available MSA/MD:</th>
            </tr>
            <tr className="border_bottom"  >
              <th width="50%">
                {" "}
                <Select
                  onChange={this.handleStateUpdate}
                  placeholder="Select a state..."
                  searchable={true}
                  autoFocus
                  openOnFocus
                  simpleValue
                  options={stateOptions}
                />
              </th>
              <th width="50%"> {this.loadMsaSelect(subsetYear)}</th>
            </tr>
            <tr>
              <th width="50%">Variable 1:</th>
              <th width="50%">Variable 2:</th>
            </tr>
            <tr>
             <th width="50%"> {this.loadVarSelect('1','FIRST')}</th>
             <th width="50%"> {this.loadVarSelect('2','SECOND')}</th>
            </tr>
          </thead>
        <tfoot>
 <tr ><td className="subsetFooterBack"><button>BACK</button></td>
 <td className="subsetFooterNext"><button>NEXT</button></td></tr>
</tfoot>
        </table>
        <div />
      </div>
    );
  }
}

export default Subsets;
