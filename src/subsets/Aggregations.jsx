import React from 'react'
import STATEOBJ from '../constants/stateObj.js'
import VARIABLES from '../constants/variables.js'

function buildRows(aggregations, v1, p1, v2, p2) {
  const agg = [...aggregations]
  const rows = []

  for(let i=0; i<p1.length; i++){
    const row = []
    row.push(<th key="header">{VARIABLES[v1].mapping[p1[i]]}</th>)
    if(p2) {
      for(let j=0; j<p2.length; j++){
        const currAgg = extractAgg(agg, v1, p1[i], v2, p2[j])
        row.push(<td key={`count${i}${j}`}>{currAgg.count}</td>)
        row.push(<td key={`sum${i}${j}`}>{currAgg.sum}</td>)
      }
    }else{
      const currAgg = extractAgg(agg, v1, p1[i])
      row.push(<td key={`count${i}`}>{currAgg.count}</td>)
      row.push(<td key={`sum${i}`}>{currAgg.sum}</td>)
    }
    rows.push(<tr key={i}>{row}</tr>)
  }
  return <>{rows}</>

}

function extractAgg(agg, v1, sv1, v2, sv2){
  for(let i=0; i<agg.length; i++){
    if(agg[i][v1][0] === sv1 && (!v2 || agg[i][v2][0] === sv2)){
      return agg.splice(i, 1)[0]
    }
  }
}

function makeHeader(params, v1, v2) {
  const list = []
  if(params.state) list.push(<li key="0"><h4>State:</h4><ul className="sublist"><li>{STATEOBJ[params.state]}</li></ul></li>)
  if(params.msamd) list.push(<li key="1"><h4>MSA/MD:</h4><ul className="sublist"><li>{params.msamd}</li></ul></li>)
  list.push(<li key="2"><h4>{VARIABLES[v1].label}:</h4><ul className="sublist">{params[v1].map((v, i) => {
    return <li key={i}>{VARIABLES[v1].mapping[v]}</li>
  })}</ul></li>)
  if(v2 && params[v2]) list.push(<li key="3"><h4>{VARIABLES[v2].label}:</h4><ul className="sublist">{params[v2].map((v, i) => {
    return <li key={i}>{VARIABLES[v2].mapping[v]}</li>
  })
  }</ul></li>)

  return <ul>{list}</ul>
}

const Aggregations = ({details, variablesArr}) => {
  const {aggregations, parameters } = details
  const v1 = variablesArr[0]
  const v2 = variablesArr[1]

  if(!aggregations) return null

  return (
    <div className="Aggregations">
      <h2>Subset Aggregations</h2>
      {makeHeader(parameters, v1, v2)}
      <table>
        <thead>
          {v2 && parameters[v2] ?
            <>
              <tr>
                <th></th>
                {parameters[v2].map((v, i) =>{
                  return (
                    <th colSpan={2} key={i}>{VARIABLES[v2].mapping[v]}</th>
                  )
                })}
              </tr>
              <tr>
                <th></th>
                {parameters[v2].map((v, i) =>{
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
          {buildRows(aggregations, v1, parameters[v1], v2, parameters[v2])}
        </tbody>
       </table>
    </div>
  )
}
export default Aggregations
