import stateToMsas from '../constants/stateToMsas.js'
import STATEOBJ from '../constants/stateObj.js'
import MSATONAME from '../constants/msaToName.js'
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
  options.push({
    value: '' + id,
    label:  `${id} - ${name}`,
  })
}

function createGeographyOptions(props) {
  const subsetYear = props.location.pathname.split('/')[2]

  const statesWithMsas = stateToMsas[subsetYear]
  let geographyOptions = [{value: 'nationwide', label: 'NATIONWIDE'}]

  Object.keys(statesWithMsas).forEach(state => {
    //state code
    if(state.length === 2) {
      createStateOption(state, geographyOptions)
      statesWithMsas[state].forEach(msa => createMSAOption(msa, MSATONAME[msa], geographyOptions))
    } else {
      /*
      //multistate
      statesWithMsas[state].forEach(msaMd => {
        geographyOptions.push({
          value: msaMd,
          label:  `${msaMd.replace('multi','')} - ${MSATONAME[msaMd]} - ENTIRE MSA/MD`
        })
      })
      */
    }
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
