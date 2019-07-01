import React from 'react'
import VARIABLES from '../constants/variables.js'

function renderCheckboxes(variable, vars, makeCb) {
  return VARIABLES[variable].options.map((v) => {
    return (
      <div className="CheckboxWrapper" key={v.id}>
        <input checked={!!vars[variable][v.id]} onChange={makeCb(variable, v)} id={variable + v.id} type="checkbox"></input>
        <label htmlFor={variable + v.id}>{v.name}</label>
      </div>
    )
  })
}

const CheckboxContainer = props => {
  const { vars, selectedVar, callbackFactory } = props

  return (
    <div className="CheckboxContainer">
      <div className="border">
        <h3>{VARIABLES[selectedVar].label}</h3>
        {renderCheckboxes(selectedVar, vars, callbackFactory)}
      </div>
    </div>
  )
}
export default CheckboxContainer
