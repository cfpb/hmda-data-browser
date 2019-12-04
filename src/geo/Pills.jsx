import React from 'react'
import Pill from './Pill.jsx'
import LoadingIcon from '../common/LoadingIcon.jsx'

function makeCloser(values, index, onChange) {
  return function () {
    const selected = []
    for(let i=0; i<values.length; i++){
      if(i !== index) selected.push(values[i])
    }
    onChange(selected)
  }
}

const Pills = ({values, onChange, loading}) => {
  return (
    <div className="Pills">
      {values.map((v, i) => {
        return  <Pill key={i} value={v.label} close={makeCloser(values, i, onChange)}/>
      })}
      {loading && <LoadingIcon className="LoadingInline" />}
    </div>
  )
}

export default Pills
