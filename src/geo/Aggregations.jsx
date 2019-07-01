import React from 'react'
import STATEOBJ from '../constants/stateObj.js'
import MSATONAME from '../constants/msaToName.js'
import VARIABLES from '../constants/variables.js'

function formatWithCommas(str) {
  str = str + ''
  let formatted = ''
  let comma = ','
  for(let i = str.length; i > 0; i-=3) {
    let start = i - 3
    if(start < 0) start = 0
    if(start === 0) comma = ''
    formatted = `${comma}${str.slice(start, i)}${formatted}`
  }
  return formatted
}

function buildRows(aggregations, v1, p1, v2, p2) {
  const agg = [...aggregations]
  const rows = []

  for(let i=0; i<p1.length; i++){
    const row = []
    row.push(<th key="header">{VARIABLES[v1].mapping[encodeURIComponent(p1[i])]}</th>)
    if(p2) {
      for(let j=0; j<p2.length; j++){
        const currAgg = extractAgg(agg, v1, p1[i], v2, p2[j])
        row.push(<td key={`count${i}${j}`}>{formatWithCommas(currAgg.count)}</td>)
        row.push(<td key={`sum${i}${j}`}>{formatWithCommas(currAgg.sum)}</td>)
      }
    }else{
      const currAgg = extractAgg(agg, v1, p1[i])
      row.push(<td key={`count${i}`}>{formatWithCommas(currAgg.count)}</td>)
      row.push(<td key={`sum${i}`}>{formatWithCommas(currAgg.sum)}</td>)
    }
    rows.push(<tr key={i}>{row}</tr>)
  }
  return <>{rows}</>

}

function extractAgg(agg, v1, sv1, v2, sv2){
  for(let i=0; i<agg.length; i++){
    if(agg[i][v1] === sv1 && (!v2 || agg[i][v2] === sv2)){
      return agg.splice(i, 1)[0]
    }
  }
}

function makeHeader(params, v1, p1, v2, p2) {
  const list = []
  if(params.state) list.push(<li key="0"><h4>State:</h4><ul className="sublist"><li>{params.state.split(',').map(v => STATEOBJ[v]).join(', ')}</li></ul></li>)
  if(params.msamd) list.push(<li key="1"><h4>MSA/MD:</h4><ul className="sublist"><li>{params.msamd.split(',').map(v => `${v}\u00A0-\u00A0${MSATONAME[v]}`).join(', ')}</li></ul></li>)
  list.push(<li key="2"><h4>{VARIABLES[v1].label}:</h4><ul className="sublist">{p1.map((v, i) => {
    return <li key={i}>{VARIABLES[v1].mapping[encodeURIComponent(v)]}</li>
  })}</ul></li>)
  if(v2 && params[v2]) list.push(<li key="3"><h4>{VARIABLES[v2].label}:</h4><ul className="sublist">{p2.map((v, i) => {
    return <li key={i}>{VARIABLES[v2].mapping[encodeURIComponent(v)]}</li>
  })
  }</ul></li>)

  return <ul>{list}</ul>
}

const Aggregations = ({details, variableOrder}) => {
  const {aggregations, parameters } = details
  const v1 = variableOrder[0]
  const v2 = variableOrder[1]
  const p1 = v1 && parameters[v1].split(',')
  const p2 = v2 && parameters[v2] && parameters[v2].split(',')

  if(!aggregations) return null

  return (
    <div className="Aggregations">
      <h2>Subset Aggregations</h2>
      {makeHeader(parameters, v1, p1, v2, p2)}
      <table>
        <thead>
          {v2 && p2 ?
            <>
              <tr>
                <th></th>
                {p2.map((v, i) =>{
                  return (
                    <th colSpan={2} key={i}>{VARIABLES[v2].mapping[encodeURIComponent(v)]}</th>
                  )
                })}
              </tr>
              <tr>
                <th></th>
                {p2.map((v, i) =>{
                  return (
                    <React.Fragment key={i}>
                      <th># of Records</th>
                      <th>$ Amount</th>
                    </React.Fragment>
                  )
                })}
              </tr>
            </>
            :
              <tr>
                <th></th>
                <th># of Records</th>
                <th>$ Amount</th>
              </tr>
          }
        </thead>
        <tbody>
          {buildRows(aggregations, v1, p1, v2, p2)}
        </tbody>
       </table>
    </div>
  )
}
export default Aggregations
