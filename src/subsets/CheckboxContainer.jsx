import React from 'react'
import VARIABLES from '../constants/variables.js'

function renderCheckboxes(variable, makeCb) {
  return VARIABLES[variable].options.map((v) => {
    return (
      <div className="CheckboxWrapper" key={v.id}>
        <input onChange={makeCb(variable, v)} id={variable + v.id} type="checkbox"></input>
        <label htmlFor={variable + v.id}>{v.name}</label>
      </div>
    )
  })
}

const CheckboxContainer = props => {
  const { vars, position, callbackFactory } = props
  const index = position - 1
  return (
    <div className="CheckboxContainer">
      {vars.length > index
        ?
          <div className="border">
            <h3>{VARIABLES[vars[index]].label}</h3>
            {renderCheckboxes(vars[index], callbackFactory)}
          </div>
        :
          <div className="PlaceholderBorder border">
            <span>Variable {position} Options</span>
          </div>
      }
    </div>
  )
}
export default CheckboxContainer
