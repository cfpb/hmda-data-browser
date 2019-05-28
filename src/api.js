function makeSubsetUrl(obj) {
  let url = 'https://hmda4.demo.cfpb.gov/v2/data-browser-api/view'
  if (obj.state){
    if(obj.state === 'nationwide') url += '/nationwide'
    else url += '/state/' + obj.state
  }
  if (obj.msaMd) url += '/msamd/' + obj.msaMd

  //csv logic

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

export function getSubset(obj){
  return Promise.resolve(makeSubsetUrl(obj))
}
