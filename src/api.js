import fileSaver from 'file-saver'

function addVariableParams(obj) {
  let qs = ''
  const vars = obj.variables
  if(vars) {
    const keys = Object.keys(vars)
    keys.forEach(key => {
      const varKeys = Object.keys(vars[key])
      if(varKeys.length){
        qs += `&${key}=`
        varKeys.forEach((k, i) => {
          if(i) qs += ','
          qs += k
        })
      }
    })
  }
  return qs
}

function createGeographyQuerystring(obj) {
  let qs = '?'
  let isFirstParam = true
  const geos = ['states', 'msamds']
  geos.forEach(v => {
    if(obj[v].length){
      if(isFirstParam) isFirstParam = false
      else qs += '&'
      qs += `${v}=${obj[v].join(',')}`
    }
  })
  return qs
}

function makeUrl(obj, isCSV, includeVariables=true) {
  let url = '/v2/data-browser-api-new/view'

  if(obj.nationwide) url += '/nationwide'

  if(isCSV) url += '/csv'
  else url += '/aggregations'

  if(obj.nationwide){
    if(includeVariables) url += '?' + addVariableParams(obj).slice(1)
  }else {
    url += createGeographyQuerystring(obj)
    if(includeVariables) url += addVariableParams(obj)
  }



  return url
}

function runFetch(url, isCSV) {

  let headers = { Accept: 'application/json' }

  if (isCSV) {
    headers = {
      'Content-Type': 'text/csv',
      Accept: 'text/csv, text/plain'
    }
  }

  var fetchOptions = {
    method: 'GET',
    headers: headers
  }

  return fetch(url, fetchOptions)
    .then(response => {
      if(response.status > 399) throw response
      return new Promise(resolve => {
        if (isCSV) {
          return resolve(response.text())
        }
        resolve(response.json())
      })
    })
}

function makeCSVName(obj, includeVariables=true) {
  let name = ''
  if(obj.states.length) name += obj.states.join(',') + '-'
  if(obj.msamds.length) name += obj.msamds.join(',') + '-'
  if(obj.nationwide) name = 'nationwide-'

  if(obj.variables && includeVariables){
    Object.keys(obj.variables).forEach(key => {
      name += key + '-'
    })
  }

  name = name.slice(0, -1)

  name += '.csv'

  return name
}

export function getSubsetDetails(obj){
  return runFetch(makeUrl(obj))
}

function getCSV(url, name){
  return runFetch(url, true).then(csv => {
          return fileSaver.saveAs(
            new Blob([csv], { type: 'text/csv;charset=utf-16' }),
            name
    )
  })
}

export function getGeographyCSV(obj){
  return getCSV(makeUrl(obj, true, false), makeCSVName(obj, false))
}

export function getSubsetCSV(obj){
  return getCSV(makeUrl(obj, true), makeCSVName(obj))
}
