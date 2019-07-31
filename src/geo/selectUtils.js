import stateToMsas from '../constants/stateToMsas.js'
import STATEOBJ from '../constants/stateObj.js'
import MSATONAME from '../constants/msaToName.js'
import MSATOSTATE from '../constants/msaToState.js'
import VARIABLES from '../constants/variables.js'

function formatWithCommas(str='') {
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

function createStateOption(state, options){
  if(state !== 'NA') options.push({value: state, label: `${STATEOBJ[state]} - STATEWIDE`})
}

function createMSAOption(id, name, options){
  const stateLabel = MSATOSTATE[id].map(v => STATEOBJ[v]).join(' - ')
  options.push({
    value: '' + id,
    label:  `${id} - ${name} - ${stateLabel}`,
  })
}

function createGeographyOptions(props) {
  const subsetYear = props.location.pathname.split('/')[2]

  const statesWithMsas = stateToMsas[subsetYear]
  let geographyOptions = [{value: 'nationwide', label: 'NATIONWIDE'}]

  const multi = new Set()

  Object.keys(statesWithMsas).forEach(state => {
    createStateOption(state, geographyOptions)
    statesWithMsas[state].forEach(msa => {
      if(MSATOSTATE[msa].length > 1) multi.add(msa)
      else createMSAOption(msa, MSATONAME[msa], geographyOptions)
    })
  })

  multi.forEach(msa => {
    createMSAOption(msa, MSATONAME[msa], geographyOptions)
  })

  return geographyOptions
}

function createVariableOptions() {
  return Object.keys(VARIABLES).map(variable => {
    return { value: variable, label: VARIABLES[variable].label }
  })
}

const geographyStyleFn = {
  option: (provided, state) => {
    const value = state.data.value
   if (value.length === 2 || value === 99999) {
     return {
       ...provided,
       fontWeight: 'bold',
       textDecoration: 'underline'
     }
   }
   return provided
  }
}

export {
  createStateOption,
  createMSAOption,
  createGeographyOptions,
  createVariableOptions,
  geographyStyleFn,
  formatWithCommas
}
