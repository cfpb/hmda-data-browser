import React, { Component } from "react";
import Select from "react-select";
import Header from "../common/Header.jsx";
import STATES from "../constants/states.js";
import stateToMsas from "../constants/stateToMsas.js";
import ACTIONSTAKEN from "../constants/actionsTaken.js";
import RACES from "../constants/races.js";
import VARIABLES from "../constants/variables.js";

import "./Subsets.css";

const stateOptions = STATES.map(state => {
  return { value: state.id, label: state.name };
});

const variableOptions = VARIABLES.map(variable => {
  return { value: variable.id, label: variable.label };
});

class Subsets extends Component {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(e) {
    this.setState({ ...e });
  }

  generateVariables() {
    if (!VARIABLES) {
      return "";
    }
    let toRender = [];
    let variablesToRender = [];
    let variableCounter = 1;
    let checkboxList = [];
    VARIABLES.forEach((variable, index) => {
      variablesToRender.push({ variable });

      if (variablesToRender.length === 1 || index === VARIABLES.length - 1) {
        if (this.state && this.state["selectVar" + variableCounter]) {
        }

        toRender.push(
          <div key={index} className="blockHeader">
            {variablesToRender.map((variableToRender, index) => {
              return (
                <p key={index + "checkbox"}>Variable {variableCounter}: </p>
              );
            })}
            <div className="blockVarDropDown">
              {this.loadVarSelect(variableCounter++)}
            </div>
          </div>
        );
      }
      variablesToRender = [];
    });
    return toRender;
  }

  loadMsaSelect(subsetYear) {
    let msaMds =
      stateToMsas[subsetYear][
        this.state && this.state.selectedState
          ? this.state.selectedState.value
          : ""
      ];
    let msaMdsOptions = msaMds
      ? msaMds.map(msaMd => {
          return { value: msaMd.id, label: msaMd.id + " - " + msaMd.name };
        })
      : [{ id: "", value: "" }];

    return (
      <Select
        isDisabled={false}
        onChange={e => this.handleSelect({ selectedMSA: e })}
        placeholder="Select MSA/MD..."
        searchable={true}
        autoFocus
        openOnFocus
        simpleValue
        options={msaMdsOptions}
        name="stateSelect"
        value={this.state ? this.state.selectMsaMds : ""}
      />
    );
  }

  loadVarSelect(varCounter) {
    return (
      <Select
        key={"selectVar" + varCounter}
        isDisabled={false}
        onChange={e => this.handleSelect({ ["selectVar" + varCounter]: e })}
        placeholder={"Select a variable..."}
        searchable={true}
        autoFocus
        openOnFocus
        simpleValue
        options={this.filterSelectedOptions(variableOptions, [
          "selectVar" + varCounter
        ])}
      />
    );
  }

  filterSelectedOptions(variableOptions, selectName) {
 
    return variableOptions;
  }

  render() {
    const { location } = this.props;
    const subsetYear = location ? location.pathname.split("/")[2] : "NA";
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
        <div className="blockHeaderContainer">
          <div className="blockHeader">
            <p>Select a State (or Nationwide): </p>
          </div>
          <div className="blockHeader">
            <p>Choose an available MSA/MD:</p>
          </div>
        </div>
        <div className="blockDropDown">
          {" "}
          <Select
            onChange={e => this.handleSelect({ selectedState: e })}
            placeholder="Select a state..."
            searchable={true}
            autoFocus
            openOnFocus
            simpleValue
            options={stateOptions}
          />{" "}
        </div>
        <div className="blockDropDown"> {this.loadMsaSelect(subsetYear)}</div>
        <div className="blockHeaderContainer">{this.generateVariables()}</div>
        <div className="Buttons">
          <button className="backButton">BACK</button>
          <button className="nextButton">NEXT</button>
        </div>
      </div>
    );
  }
}
export default Subsets;
