import React from 'react'
import STATEOBJ from '../constants/stateObj.js'
import MSATONAME from '../constants/msaToName.js'
import VARIABLES from '../constants/variables.js'
import { formatWithCommas } from './selectUtils.js'

function buildRows(aggregations, variableOrder) {
  return aggregations.map((row, i) => {
    return (
      <tr key={i}>
        <th>{variableOrder.map(v => VARIABLES[v].mapping[encodeURIComponent(row[v])]).join(', ')}</th>
        <td>{formatWithCommas(row.count)}</td>
        <td>{formatWithCommas(row.sum)}</td>
      </tr>
    )
  })
}

function makeHeader(params, variableOrder) {
  const list = []
  if(params.state) list.push(<li key="0"><h4>State:</h4><ul className="sublist"><li>{params.state.split(',').map(v => STATEOBJ[v]).join(', ')}</li></ul></li>)
  if(params.msamd) list.push(<li key="1"><h4>MSA/MD:</h4><ul className="sublist"><li>{params.msamd.split(',').map(v => `${v}\u00A0-\u00A0${MSATONAME[v]}`).join(', ')}</li></ul></li>)

  variableOrder.forEach((variable, i) => {
    list.push(
      <li key={variable}>
        <h4>{VARIABLES[variable].label}:</h4>
        <ul className="sublist">
          {params[variable].split(',').map((v, i) => {
            return <li key={i}>{VARIABLES[variable].mapping[encodeURIComponent(v)]}</li>
          })}
        </ul>
      </li>
    )
  })

  return <ul>{list}</ul>
}

// eslint-disable-next-line
const Aggregations = React.forwardRef((props, ref) => {
  const { aggregations, parameters } = props.details
  const { variableOrder } = props
  if(!aggregations) return null

  return (
    <div ref={ref} className="Aggregations">
      <h2>Data Summary</h2>
      {makeHeader(parameters, variableOrder)}
      <table>
        <thead>
          <tr>
            <th>Selected Variables</th>
            <th># of Records</th>
            <th>$ Amount</th>
          </tr>
        </thead>
        <tbody>
          {buildRows(aggregations, variableOrder)}
        </tbody>
       </table>
    </div>
  )
})
export default Aggregations
