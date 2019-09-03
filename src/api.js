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

function addYears(url) {
  if(url.match(/\?/)) return '&years=2018'
  return '?years=2018'
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
  let url = '/v2/data-browser-api/view'

  if(obj.nationwide) url += '/nationwide'

  if(isCSV) url += '/csv'
  else url += '/aggregations'

  if(obj.nationwide){
    if(includeVariables) url += '?' + addVariableParams(obj).slice(1)
  }else {
    url += createGeographyQuerystring(obj)
    if(includeVariables) url += addVariableParams(obj)
  }

  url += addYears(url)

  return url
}

function runFetch(url) {

  let headers = { Accept: 'application/json' }

  var fetchOptions = {
    method: 'GET',
    headers: headers
  }

  return fetch(url, fetchOptions)
    .then(response => {
      if(response.status > 399) throw response
      return new Promise(resolve => {
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
  let a = document.createElement('a')
  a.href = url
  a.style.display = 'none'
  a.setAttribute('type', 'hidden')
  a.setAttribute('download', name)
  document.body.appendChild(a)
  a.click()
  a.remove()
  a = null
}

export function getGeographyCSV(obj){
  return getCSV(makeUrl(obj, true, false), makeCSVName(obj, false))
}

export function getSubsetCSV(obj){
  return getCSV(makeUrl(obj, true), makeCSVName(obj))
}
