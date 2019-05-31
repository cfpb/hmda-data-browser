function makeSubsetUrl(obj, isCSV) {
  let url = '/v2/data-browser-api/view'
  if (obj.state){
    if(obj.state === 'nationwide') url += '/nationwide'
    else url += '/state/' + obj.state
  }
  if (obj.msaMd) url += '/msamd/' + obj.msaMd

  if(isCSV) url += '/csv'

  url += '?'

  const vars = obj.variables
  const keys = Object.keys(vars)
  let isFirstParam = true
  keys.forEach(key => {
    const varKeys = Object.keys(vars[key])
    if(varKeys.length){
      if(isFirstParam) isFirstParam = false
      else url += '&'
      url += key + '='
      varKeys.forEach((k, i) => {
        if(i) url += ','
        url += k
      })
    }
  })

  return url
}

function runFetch(url, options = { method: 'GET' }) {

  let headers = { Accept: 'application/json' }

  if (options.params && options.params.format === 'csv') {
    headers = {
      'Content-Type': 'text/csv',
      Accept: 'text/csv'
    }
  }

  var fetchOptions = {
    method: options.method || 'GET',
    body: options.body,
    headers: headers
  }

  return fetch(url, fetchOptions)
    .then(response => {
      return new Promise(resolve => {
        if (options.params && options.params.format === 'csv') {
          return resolve(response.text())
        }
        resolve(response.json())
      })
    })
    .catch(err => {
      console.error(err)
    })
}

export function getSubsetDetails(obj){
  return runFetch(makeSubsetUrl(obj))
}

export function getSubsetCSV(obj){
  return runFetch(makeSubsetUrl(obj, true))
}
