import React, { Component } from "react";
import Select from "react-select";
import Header from "../common/Header.jsx";
import STATES from "../constants/states.js";
import stateToMsas from "../constants/stateToMsas.js";
import ACTIONSTAKEN from "../constants/actionsTaken.js";
import RACES from "../constants/races.js";
import variables from "../constants/variables.js";

import "./Subsets.css";

const stateOptions = STATES.map(state => {
  return { value: state.id, label: state.name };
});

const actionsTakenOptions = ACTIONSTAKEN.map(actionTaken => {
  return { value: actionTaken.id, label: actionTaken.name };
});

const raceOptions = RACES.map(race => {
  return { value: race.id, label: race.name };
});

const getCheckBoxRows = (options,selection) => {
  let toRender = [];
  let checkboxesToRender = [];

  options.forEach((option, index) => {
    checkboxesToRender.push(option);

    if (selection &&(checkboxesToRender.length === 2 || index === options.length - 1)) {
      toRender.push(
        <table key={index}>
        <tbody key={index}>
        <tr key={index}>
          {checkboxesToRender.map((checkboxToRender, index) => {
            return (
              <td
                style={{ textAlign: "left" }}
                key={checkboxToRender.label + index}
                className ="checkBoxRow"
              >
                <input
                  type="checkbox"
                  name={index + checkboxToRender.label}
                  value={checkboxesToRender.label}
                />
                {checkboxToRender.label}
              </td>
            );
          })}
        </tr>
        </tbody>
        </table>
      );

      checkboxesToRender = [];
    }
  });
  return toRender;
};

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

  loadVarSelect(varOption, varListName) {
    let varList = variables[varOption][varListName];
    let varOptions = varList
      ? varList.map(variableOption => {
          return { value: variableOption.id, label: variableOption.name };
        })
      : [{ id: "", value: "" }];
    return (
      <Select
        isDisabled={this.state.selectState.value ? false : true}
        onChange={
          varOption === "1"
            ? this.handleActionTakenUpdate
            : this.handleRaceUpdate
        }
        placeholder={"Select variable" + varOption + "..."}
        searchable={true}
        autoFocus
        openOnFocus
        simpleValue
        options={varOptions}
        value={
          varOption === "1"
            ? this.state.selectActionTaken
            : this.state.selectRace
        }
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
    const {location}  = this.props;
    const subsetYear = location?location.pathname.split("/")[2]:"NA";

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
        <table>
          <thead />
          <tbody>
            <tr>
              <th width="50%">Select a State: </th>
              <th width="50%">Choose an available MSA/MD:</th>
            </tr>
            <tr>
              <td width="50%">
                <Select
                  onChange={this.handleStateUpdate}
                  placeholder="Select a state..."
                  searchable={true}
                  autoFocus
                  openOnFocus
                  simpleValue
                  options={stateOptions}
                />
              </td>
              <td className="DropDown" width="50%">
                {" "}
                {this.loadMsaSelect(subsetYear)}
              </td>
            </tr>
            <tr>
              <th width="50%">Variable 1:</th>
              <th width="50%">Variable 2:</th>
            </tr>
            <tr>
              <td className="DropDown" width="50%">
                {" "}
                {this.loadVarSelect("1", "FIRST")}
              </td>
              <td className="DropDown" width="50%">
                {" "}
                {this.loadVarSelect("2", "SECOND")}
              </td>
            </tr>
            <tr />
            <tr>
            <td  className="actionsTakenBoxes" width="50%">{getCheckBoxRows(actionsTakenOptions,this.state.selectActionTaken)}</td>
            <td  width="50%">{getCheckBoxRows(raceOptions,this.state.selectRace)}</td>
            </tr>
          </tbody>
          <tfoot />
        </table>

        <div className="Buttons">
          <button className="backButton">BACK</button>
          <button className="nextButton">NEXT</button>
        </div>
      </div>
    );
  }
}

export default Subsets;
