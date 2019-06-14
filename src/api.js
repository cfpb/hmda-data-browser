import fileSaver from 'file-saver'

function makeVariableQuerystring(obj) {
  let qs = ''
  const vars = obj.variables
  if(vars) {
    qs = '?'
    const keys = Object.keys(vars)
    let isFirstParam = true
    keys.forEach(key => {
      const varKeys = Object.keys(vars[key])
      if(varKeys.length){
        if(isFirstParam) isFirstParam = false
        else qs += '&'
        qs += key + '='
        varKeys.forEach((k, i) => {
          if(i) qs += ','
          qs += k
        })
      }
    })
  }
  return qs
}

function addGeographyParams(obj) {
  let qs = ''
  const geos = ['states', 'msamds']
  geos.forEach(v => {
    if(obj[v].length){
      qs += `&${v}=${obj[v].join(',')}`
    }
  })
  return qs
}

function makeUrl(obj, isCSV) {
  let url = '/v2/data-browser-api-new/view'

  if(obj.nationwide) url += '/nationwide'

  if(isCSV) url += '/csv'
  else url += '/aggregations'

  url += makeVariableQuerystring(obj)
  if(!obj.nationwide){
    let geoParams = addGeographyParams(obj)
    if(!obj.variables) geoParams = '?' + geoParams.slice(1)
    url += geoParams
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

function makeCSVName(obj) {
  let name = ''
  if(obj.states) name += obj.states.join(',') + '-'
  if(obj.msamds) name += obj.msamds.join(',') + '-'

  if(obj.variables){
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

export function getCSV(obj){
  return runFetch(makeUrl(obj, true), true).then(csv => {
          return fileSaver.saveAs(
            new Blob([csv], { type: 'text/csv;charset=utf-16' }),
            makeCSVName(obj)
    )
  })
}
