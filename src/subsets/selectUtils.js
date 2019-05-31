import stateToMsas from '../constants/stateToMsas.js'
import STATEOBJ from '../constants/stateObj.js'
import VARIABLES from '../constants/variables.js'

function createGeographyOptions(props) {
  const subsetYear = props.location.pathname.split('/')[2]

  const statesWithMsas = stateToMsas[subsetYear]
  let geographyOptions = [{value: 'nationwide', label: 'NATIONWIDE'}]

  Object.keys(statesWithMsas).forEach(state => {
    //state code
    if(state.length === 2) {
      geographyOptions.push({value: state, label: `${STATEOBJ[state]} - STATEWIDE`})
      statesWithMsas[state].forEach(msaMd => {
        geographyOptions.push({
          value: msaMd.id,
          label:  `${msaMd.id} - ${msaMd.name} - ${STATEOBJ[state]}`,
          state: state
        })
      })
    } else {
      //multistate
      statesWithMsas[state].forEach(msaMd => {
        geographyOptions.push({
          value: msaMd.id,
          label:  `${msaMd.id.replace('multi','')} - ${msaMd.name} - ENTIRE MSA/MD`
        })
      })
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
   if (state.data.value.length === 2) {
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
  createGeographyOptions,
  createVariableOptions,
  geographyStyleFn
}
