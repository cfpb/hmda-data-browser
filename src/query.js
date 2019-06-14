function makeParam(s, key) {
  if(key === 'variables'){
    const vars = s[key]
    return Object.keys(vars).map(v =>{
      return `${v}=${Object.keys(vars[v]).join(',')}`
    }).join('&')
  }
  if(key === 'details'){
    return Object.keys(s[key]).length ? 'getDetails=1' : ''
  }
  return stringifyIfTruthy(s, key)
}

function stringifyIfTruthy(s, key) {
  const v = s[key]
  if(Array.isArray(v))
    return v.length ? formatParam(key, v.join(',')) : ''
  return v ? formatParam(key, v.toString()) : ''
}

function formatParam(k,v){
  return `${k}=${v}`
}

export function makeSearchFromState(s){
  let params = [
    makeParam(s, 'states'),
    makeParam(s, 'msamds'),
    makeParam(s, 'nationwide'),
    makeParam(s, 'variables'),
    makeParam(s, 'details')
  ]

  params = params.filter(v => v)
  const str = `?${params.join('&')}`

  if(str.length === 1) return ''

  return str
}

export function parseQuerystring(search){
  const obj = {}

  search.slice(1).split('&').forEach(v => {
    const spl = v.split('=')
    obj[spl[0]] = spl[1]
  })

  return obj
}
